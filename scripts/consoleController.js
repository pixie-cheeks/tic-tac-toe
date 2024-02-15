const gameConsole = (() => {
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
    if (message.eventName === 'gameRetry') {
      text = 'Enter `gameConsole.restart()` if you want to play again.';
    }
    console.log(text);
  }

  function printNewRound(message) {
    printBoard();
    printMessage(message);
  }

  function playRound(row, column) {
    events.triggerEvent('playConsole', { row, column });
  }

  function restart() {
    events.triggerEvents('gameRestartConsole', null);
  }

  return { playRound, restart }
})();