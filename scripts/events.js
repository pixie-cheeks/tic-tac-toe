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
  triggerEvent(eventName, data, noObj = false) {
    if (!this.events[eventName]) return;

    let dataObj = noObj ? data : { eventName, data };

    this.events[eventName].forEach(handler => handler(dataObj));
  },
};