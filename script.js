const events = {
  events: {},
  addListener(eventName, handler) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(handler);
  },
  removeListener(eventName, handler) {
    let eventHandlers = this.events[eventName];
    if (!eventHandlers) return;

    for (let i = 0; i < eventHandlers.length; i++) {
      if (eventHandlers[i] === handler) {
        eventHandlers.splice(i, 1);
        break;
      }
    }
  },
  triggerEvent(eventName, data) {
    if (!this.events[eventName]) return;
    const dataObj = { eventName, data };

    this.events[eventName].forEach(handler => handler(dataObj));
  },
};

const Cell = (valueID) => {
  let value;
  setValue(valueID);

  function getValue() { return value };

  function setValue(number) {
    switch (number) {
      case 0:
        value = ' ';
        break
      case 1:
        value = 'X';
        break
      case 2:
        value = 'O';
    }
  };

  return { setValue, getValue };
}

const gameBoard = (() => {
  const board = [];

  for (let i = 0; i < 3; i++) {
    board[i] = [];
    for (let j = 0; j < 3; j++) {
      board[i].push(Cell(0));
    }
  }

  const rowsOfThree = (() => {
    let array = [];
    for (let i = 0; i < 8; i++) {
      array.push([]);
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 3; j++) {
        if (i <= 2) array[i].push(board[i][j]);
        if (i >= 3 && i <= 5) array[i].push(board[j][i - 3]);
        if (i === 6) array[i].push(board[j][j]);
        if (i === 7) array[i].push(board[2 - j][j]);
      }
    }

    return array;
  })();

  function setMarker(row, column, markerID) {
    if (board[row][column].getValue() !== ' ') return false;

    board[row][column].setValue(markerID);
    return true;
  }

  function getBoard() { return board; }

  function clearBoard() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[i][j].setValue(0);
      }
    }

  }

  return { setMarker, getBoard, clearBoard, rowsOfThree };
})();

const Player = (name, marker) => {
  function getName() {
    return name;
  }

  function getMarker() {
    return marker;
  }

  return { getName, getMarker };
};

const GameController = (playerOne, playerTwo) => {
  const players = [
    Player(playerOne = 'One', 1),
    Player(playerTwo = 'Two', 2),
  ];
  let activePlayer = players[0];
  let cellsFilled = 0;
  let gameOverState = false;

  events.triggerEvent('gameInitialized', newRoundMessage());
  bindEvents();

  function bindEvents() {
    events.addListener('gameRestartDOM', restart);
  }

  function switchActivePlayer() {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  function newRoundMessage() {
    return `It's ${activePlayer.getName()}'s turn.`;
  }

  function playRound(row, column) {
    if (gameOverState) {
      events.triggerEvent('gameRetry', 'gameRetry');
      return;
    }
    const isOccupied = !gameBoard
      .setMarker(row, column, activePlayer.getMarker());

    if (isOccupied) {
      events.triggerEvent('cellOccupied', 'That cell is already occupied.');
      return;
    }

    cellsFilled++;
    checkOutcome();
    if (gameOverState) return;
    switchActivePlayer();
    events.triggerEvent('finishTurn', newRoundMessage())
  }

  function checkOutcome() {
    if (cellsFilled < 5) return;
    if (cellsFilled > 8) return gameOver(0);

    const winningThrees = gameBoard.rowsOfThree
      .map(row => row.map(cell => cell.getValue()));
    const hasPlayerWon = winningThrees.some(
      row => row.every(cell => cell !== ' ' && cell === row[0])
    );

    if (!hasPlayerWon) return;
    gameOver(1);
  }

  function gameOver(endCause) {
    let message = '';

    switch (endCause) {
      case 0:
        message = 'It was a draw!';
        break;
      case 1:
        message = `Player ${activePlayer.getName()} is the winner!`
    }

    gameOverState = true;
    events.triggerEvent('gameOver', message)
  }

  function restart() {
    cellsFilled = 0;
    gameOverState = false;
    activePlayer = players[0];

    gameBoard.clearBoard();
    events.triggerEvent('gameRestart', newRoundMessage())
  }

  return { playRound, restart };
};

const gameEvents = {
  newRound: ['gameInitialized', 'finishTurn', 'gameOver', 'gameRestart'],
  message: ['gameRetry', 'cellOccupied'],
};

const consoleController = (() => {
  let board = gameBoard.getBoard();

  bindEvents();

  function bindEvents() {
    gameEvents.newRound.forEach(
      eventName => events.addListener(eventName, printNewRound)
    );

    gameEvents.message.forEach(
      eventName => events.addListener(eventName, printMessage)
    );
  }

  function printBoard() {
    let text = '';

    for (let i = 0; i < 3; i++) {
      if (i > 0) text += '\n';

      for (let j = 0; j < 3; j++) {
        text += `[${board[i][j].getValue()}]`;

      }
    }

    console.log(text);
  }

  function printMessage(message) {
    let text = message.data;
    if (text === 'gameRetry') {
      text = 'Enter `game.restart()` if you want to play again.';
    }
    console.log(text);
  }

  function printNewRound(message) {
    printBoard();
    printMessage(message);
  }

})();

const displayController = (() => {
  const menuDOM = document.querySelector('.ttc-menu');
  const boardDOM = menuDOM.querySelector('.ttc-board');
  const cellsDOM = boardDOM.children;
  const messageDOM = menuDOM.querySelector('.message');
  const restartBtn = menuDOM.querySelector('button.restart');
  const resultDOm = menuDOM.querySelector('.results');

  bindEvents();
  render();

  function render() {
    const board = gameBoard.getBoard();
    let index = 0;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        cellsDOM[index++].textContent = board[i][j].getValue();
      }
    }
  }

  function bindEvents() {
    boardDOM.addEventListener('click', playRound);
    restartBtn.addEventListener('click', restartGame);

    gameEvents.newRound.forEach(
      eventName => events.addListener(eventName, playNewRound)
    );
    gameEvents.message.forEach(
      eventName => events.addListener(eventName, displayMessage)
    );
  }

  function playRound(event) {
    if (!event.target.matches('.ttc-cell')) return;
    const cell = event.target.dataset;

    game.playRound(cell.row, cell.column);
    render()
  }

  function displayMessage(message) {
    let text = message.data;
    if (text === 'gameRetry') {
      text = 'Click the restart button to play again.'
    }
    if (message.eventName == 'gameOver') {
      resultDOm.textContent = text;
      messageDOM.textContent = '';
      return;
    }

    messageDOM.textContent = text;
    resultDOm.textContent = '';
  }

  function playNewRound(message) {
    render();
    displayMessage(message);
  }

  function restartGame() {
    events.triggerEvent('gameRestartDOM', null);
  }


  return {};
})();

const game = GameController();
const dialog = document.querySelector('dialog');
dialog.showModal();