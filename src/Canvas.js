class Canvas {
  static defaultOptions = {
    resizable: true
  };

  static create(...args) {
    return new Canvas(args);
  }

  constructor(selector, options = Canvas.defaultOptions) {
    if (selector) {
      this.canvas = window.document.querySelector(selector);
      if (!this.canvas) {
        throw new Error("Invalid selector", selector);
      }
    } else {
      this.canvas = window.document.createElement("canvas");
    }

    if (options) {
      if (options.resizable) {
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener("resize", this.handleResize);
      }
      this.canvas.width = options.width || window.innerWidth;
      this.canvas.height = options.height || window.innerHeight;
    }
  }

  get element() {
    return this.canvas;
  }

  context(type = "2d", attrs) {
    return this.canvas.getContext(type, attrs);
  }

  get dimensions() {
    return {
      height: this.canvas.height,
      width: this.canvas.width
    };
  }

  handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}

export default Canvas;
