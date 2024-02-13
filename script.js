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

  return { setMarker, getBoard, clearBoard, printBoard, rowsOfThree };
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

  printNewRound();

  function switchActivePlayer() {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  function printNewRound() {
    gameBoard.printBoard();
    console.log(`It's ${activePlayer.getName()}'s turn.`);
  }

  function playRound(row, column) {
    if (gameOverState) {
      console.log('Enter `game.restart()` if you want to play again.');
      return;
    }
    const isOccupied = !gameBoard
      .setMarker(row, column, activePlayer.getMarker());

    if (isOccupied) {
      console.log('That cell is already occupied.')
      return;
    }

    cellsFilled++;
    checkOutcome();
    if (gameOverState) return;
    switchActivePlayer();
    printNewRound();
  }

  function checkOutcome() {
    if (cellsFilled < 5) return;
    if (cellsFilled > 8) return gameOver(0); // Draw or Tie function maybe
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
    gameBoard.printBoard();
    console.log(message);
  }

  function restart() {
    cellsFilled = 0;
    gameOverState = false;
    activePlayer = players[0];

    gameBoard.clearBoard();
    printNewRound();
  }

  return { playRound, restart };
};

const game = GameController();
/* const displayController = (() => {

})(); */