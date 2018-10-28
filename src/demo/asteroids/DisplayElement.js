class DisplayElement {
  constructor(selector) {
    this.el = window.document.querySelector(selector);
    this.handleTimeout = this.handleTimeout.bind(this);
  }

  get element() {
    return this.el;
  }

  handleTimeout() {
    this.hide();
  }

  hide() {
    // add hidden class and the element will hide itself
    this.el.classList.add("hidden");
  }

  show(timeoutMs = -1) {
    // remove hidden class and the element will show itself
    this.el.classList.remove("hidden");
    if (timeoutMs > 0) {
      setTimeout(this.handleTimeout, timeoutMs);
    }
  }
}

export default DisplayElement;
