class Tile {
  constructor(image, x = 0, y = 0, width = 32, height = 32) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  render(context, destX = 0, destY = 0, destWidth = null, destHeight = null) {
    context.drawImage(
      this.image,
      this.x,
      this.y,
      this.width,
      this.height,
      destX,
      destY,
      destWidth || this.width,
      destHeight || this.height
    );
  }
}

export default Tile;
