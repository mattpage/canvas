/* eslint no-underscore-dangle: ["error", { "allow": ["_element", "_lastClick", "_mouse", "_onClickHandler", "_onMoveHandler"] }] */
class Mouse {
  static defaultOptions = {
    disableDrag: true,
    disableSelect: true
  };

  constructor(element, options = Mouse.defaultOptions) {
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseClick = this.handleMouseClick.bind(this);

    const doc = window.document;

    this._lastClick = null;
    this._onClickHandler = null;
    this._onMoveHandler = null;
    this._element = element;
    this._mouse = {
      x: doc.innerWidth / 2,
      y: doc.innerHeight / 2
    };

    doc.addEventListener("mousemove", this.handleMouseMove);
    doc.addEventListener("click", this.handleMouseClick);

    const handleDisabledEvent = event => {
      event.preventDefault();
      event.stopPropagation();
    };

    if (options.disableDrag) {
      doc.addEventListener("dragstart", handleDisabledEvent);
    }
    if (options.disableSelect) {
      doc.addEventListener("selectstart", handleDisabledEvent);
    }
  }

  get offsetLeft() {
    return this._element ? this._element.offsetLeft : 0;
  }

  get offsetTop() {
    return this._element ? this._element.offsetTop : 0;
  }

  get position() {
    return {
      x: this._mouse.x - this.offsetLeft,
      y: this._mouse.y - this.offsetTop
    };
  }

  get lastClick() {
    return this._lastClick;
  }

  get onClick() {
    return this._onClickHandler;
  }

  set onClick(callback) {
    this._onClickHandler = callback;
  }

  get onMove() {
    return this._onMoveHandler;
  }

  set onMove(callback) {
    this._onMoveHandler = callback;
  }

  handleMouseClick(event) {
    this._mouse.x = event.clientX;
    this._mouse.y = event.clientY;
    this._lastClick = {
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      x: event.clientX,
      y: event.clientY,
      position: this.position
    };
    if (this._onClickHandler) {
      event.preventDefault();
      this._onClickHandler(this._lastClick, event);
    }
  }

  handleMouseMove(event) {
    this._mouse.x = event.clientX;
    this._mouse.y = event.clientY;
    if (this._onMoveHandler) {
      event.preventDefault();
      this._onMoveHandler(
        {
          x: this._mouse.x,
          y: this._mouse.y,
          position: this.position
        },
        event
      );
    }
  }
}

export default Mouse;
