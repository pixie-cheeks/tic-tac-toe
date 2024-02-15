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