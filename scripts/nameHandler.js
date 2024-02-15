const nameHandler = (() => {
  const dialog = document.querySelector('dialog');
  const players = [
    Player('Player One', 1),
    Player('Player Two', 2),
  ];
  const nameDivs = [
    document.querySelector('.left-panel .player.one .name'),
    document.querySelector('.left-panel .player.two .name'),
  ];
  const inputs = [
    dialog.querySelector('.one input'),
    dialog.querySelector('.two input'),
  ];
  const changeNameBtn = document.querySelector('button.change-name');
  const closeBtn = dialog.querySelector('.close');
  const submitBtn = dialog.querySelector('.submit');

  bindEvents();
  openDialog();

  function render(clearValues = false) {
    for (let i = 0; i < 2; i++) {
      nameDivs[i].textContent = players[i].getName();

      if (!clearValues) continue;
      inputs[i].value = '';
    }

    events.triggerEvent('namesChanged', null);
  }

  function bindEvents() {
    changeNameBtn.addEventListener('click', openDialog);
    closeBtn.addEventListener('click', closeDialog);
    dialog.addEventListener('close', updateNames);
    dialog.addEventListener('keydown', submit);
    submitBtn.addEventListener('click', updateNames);
  }

  function openDialog() {
    dialog.showModal();
  }

  function closeDialog() {
    dialog.close();
  }

  function submit(e) {
    if (e.key !== 'Enter') return;
    submitBtn.click();
    closeDialog();
  }

  function updateNames(e) {
    const noChange =
      e.type === 'close' || inputs.every(elem => elem.value === '');

    if (noChange) {
      render();
      if (dialog.checkVisibility()) closeDialog();
      return;
    }

    for (let i = 0; i < 2; i++) {
      players[i].setName(inputs[i].value);
    }

    render(true);
    closeDialog();
  }

  return { players };
})()

const game = GameController(nameHandler.players);