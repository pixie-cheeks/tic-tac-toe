const Player = (name, marker) => {
  function getName() {
    return name;
  }

  function getMarker() {
    return marker;
  }

  function setName(newName) {
    name = newName;
  }

  return { getName, getMarker, setName };
};

const GameController = (players) => {
  let activePlayer = players[0];
  let cellsFilled = 0;
  let gameOverState = false;
  let gameConclusion;

  bindEvents();

  function bindEvents() {
    events.addListener('gameRestartDOM', restart);
    events.addListener('gameRestartConsole', restart);
    events.addListener('playDOM', playRound);
    events.addListener('playConsole', playRound);
    events.addListener('namesChanged', updateMessages);
  }

  function switchActivePlayer() {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  function updateMessages() {
    if (gameOverState) {
      events.triggerEvent('updateEndMessages', endRoundMessage());
      return;
    }

    events.triggerEvent('updateMessages', newRoundMessage());
  }

  function newRoundMessage() {
    const name = activePlayer.getName();
    const apostrophe = !name.match(/s$/gi) ? "'s" : "'";

    return `It's ${name + apostrophe} turn.`;
  }

  function endRoundMessage() {
    let message = '';
    switch (gameConclusion) {
      case 0:
        message = 'It was a draw!';
        break;
      case 1:
        message = `${activePlayer.getName()} is the winner!`;
    }

    return message;
  }

  function playRound(e) {
    const cell = e.data;
    if (gameOverState) {
      events.triggerEvent('gameRetry', null);
      return;
    }
    const isOccupied = !gameBoard
      .setMarker(cell.row, cell.column, activePlayer.getMarker());

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
    const winningThrees = gameBoard.rowsOfThree
      .map(row => row.map(cell => cell.getValue()));
    const hasPlayerWon = winningThrees.some(
      row => row.every(cell => cell !== ' ' && cell === row[0])
    );

    if (!hasPlayerWon) {
      if (cellsFilled === 9) gameOver(0);
      return;
    }
    gameOver(1);
  }

  function gameOver(endCause) {
    gameConclusion = endCause;
    gameOverState = true;
    events.triggerEvent('gameOver', endRoundMessage());
  }

  function restart() {
    cellsFilled = 0;
    gameOverState = false;
    activePlayer = players[0];

    gameBoard.clearBoard();
    events.triggerEvent('gameRestart', newRoundMessage());
  }

  return { playRound, restart };
};

const gameEvents = {
  newRound: ['gameInitialized', 'finishTurn', 'gameOver', 'gameRestart'],
  message: ['gameRetry', 'cellOccupied'],
};