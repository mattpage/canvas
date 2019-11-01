class Tile {
  static create(...args) {
    return new Tile(...args);
  }

  constructor(
    image,
    x = 0,
    y = 0,
    srcX = 0,
    srcY = 0,
    width = 32,
    height = 32
  ) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.srcX = srcX;
    this.srcY = srcY;
    this.width = width;
    this.height = height;
  }

  render(
    context,
    destX = null,
    destY = null,
    destWidth = null,
    destHeight = null
  ) {
    this.image.render(
      context,
      this.srcX,
      this.srcY,
      this.width,
      this.height,
      destX || this.x,
      destY || this.y,
      destWidth || this.width,
      destHeight || this.height
    );
  }
}

export default Tile;
