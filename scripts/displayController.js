const displayBoard = (() => {
  const menuDOM = document.querySelector('.ttc-menu');
  const boardDOM = menuDOM.querySelector('.ttc-board');
  const cellsDOM = boardDOM.children;
  const restartBtn = menuDOM.querySelector('button.restart');

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

    ['gameInitialized', 'finishTurn', 'gameOver', 'gameRestart'].forEach(
      eventName => events.addListener(eventName, playNewRound)
    );
  }

  function playRound(event) {
    if (!event.target.matches('.ttc-cell')) return;

    events.triggerEvent('playDOM', event.target.dataset);
  }

  function playNewRound(e) {
    render();
    events.triggerEvent('updateMessages', e, true);
  }

  function restartGame() {
    events.triggerEvent('gameRestartDOM', null);
  }

})();

const messageBoard = (() => {

  const messages = {
    footerMessage: '',
    headerMessage: '',
  };
  const divs = {
    footerMessage: document.querySelector('.message'),
    headerMessage: document.querySelector('.results'),
  };

  bindEvents();

  function bindEvents() {
    events.addListener('updateMessages', updateMessages);
    events.addListener('updateEndMessages', updateMessages);
    ['gameRetry', 'cellOccupied'].forEach(
      eventName => events.addListener(eventName, updateMessages)
    );
  }

  function render() {
    for (let key in messages) {
      divs[key].textContent = messages[key];
    }
  }

  function updateMessages(e) {
    let message = e.data;

    switch (e.eventName) {
      case 'gameRetry':
        message = 'Click the restart button to play again.';
        messages.footerMessage = message;
        break;
      case 'gameOver':
      case 'updateEndMessages':
        messages.footerMessage = '';
        messages.headerMessage = message;
        break;
      default:
        messages.footerMessage = message;
        messages.headerMessage = '';
    }

    render();
  }

})();