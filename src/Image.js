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

  load(src, callback, ...rest) {
    this.image = Image.createElement(src, callback, ...rest);
    return this;
  }
}

export default Image;
