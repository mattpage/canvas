class Dialog {
  constructor(id, onClick) {
    this.handleClick = this.handleClick.bind(this);
    this.el = window.document.getElementById(id);
    this.el.addEventListener("click", this.handleClick);
    this.onClick = onClick;
    this.handleTimeout = this.handleTimeout.bind(this);
  }

  handleClick(event) {
    if (event && this.onClick) {
      event.preventDefault();
      event.stopPropagation();
      this.onClick(event);
    }
  }

  handleTimeout() {
    this.hide();
  }

  hide() {
    this.el.classList.add("hidden");
  }

  setText(id, text) {
    window.document.getElementById(id).textContent = text;
  }

  show(timeoutMs = -1) {
    // remove hidden class and the element will show itself
    this.el.classList.remove("hidden");
    if (timeoutMs > 0) {
      setTimeout(this.handleTimeout, timeoutMs);
    }
  }
}

export default Dialog;
