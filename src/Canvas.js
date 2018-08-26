class Canvas {

  static defaultOptions = {
    resizable: true,
  }

  constructor(selector, options=Canvas.defaultOptions) {
    this.canvas = document.querySelector(selector)
    if (!this.canvas) {
      throw new Error('Invalid selector', selector);
    }
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    if (options && options.resizable) {
      this.handleResize = this.handleResize.bind(this);
      window.addEventListener('resize', this.handleResize);
    }
  }

  context(type='2d', attrs) {
    return this.canvas.getContext(type, attrs);
  }

  get dimensions() {
    return { 
      height: this.canvas.height,
      width: this.canvas.width,
    };
  }

  handleResize(event) {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }
}

export default Canvas;
