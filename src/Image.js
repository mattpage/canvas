class Image {
  static create(...args) {
    return new Image(...args);
  }

  static createElement(src, loadCallback, ...rest) {
    const image = window.document.createElement("img", ...rest);

    if (loadCallback) {
      image.addEventListener("load", loadCallback, false);
    }
    if (src) {
      image.src = src;
    }
    return image;
  }

  constructor() {
    this.image = null;
  }

  get element() {
    return this.image;
  }

  get width() {
    if (!this.image) {
      return 0;
    }
    return this.image.naturalWidth;
  }

  get height() {
    if (!this.image) {
      return 0;
    }
    return this.image.naturalHeight;
  }

  load(src, callback, ...rest) {
    this.image = Image.createElement(src, callback, ...rest);
    return this;
  }

  render(
    context,
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    destX = 0,
    destY = 0,
    destWidth = null,
    destHeight = null
  ) {
    context.drawImage(
      this.image,
      x,
      y,
      width || this.width,
      height || this.height,
      destX,
      destY,
      destWidth || this.width,
      destHeight || this.height
    );
  }
}

export default Image;
