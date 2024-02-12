const gameboard = (() => {
  const board = [];

  for (let i = 0; i < 3; i++) {
    board[i] = [];
    for (let j = 0; j < 3; j++) {
      board[i].push(['']);
    }
  }

  showBoard();

  function setMarker(row, column, marker) {
    if (board[row][column] !== '') return;
    board[row][column] = marker;
    showBoard();
  }

  function getBoard() { return board; }

  function clearBoard() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        array[i][j] = '';
      }
    }

    showBoard();
  }

  function showBoard() {
    let text = '';
    for (let i = 0; i < 3; i++) {
      if (i > 0) text += '\n';
      for (let j = 0; j < 3; j++) {
        const mark = board[i][j] !== ''
          ? ' ' : board[i][j];
        text += `[${mark}]`;
      }
    }

    console.log(text);
  }

  return { setMarker, getBoard, clearBoard };
})();

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

  function setMarker(newMarker) {
    marker = newMarker;
  }

  return { getName, getMarker };
};

const game = (() => {

})();

const displayController = (() => {

})();