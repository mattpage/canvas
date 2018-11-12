class Particle {
  static create(...args) {
    return new Particle(...args);
  }

  constructor(
    x = 0,
    y = 0,
    width = 10,
    height = 10,
    vx = 0,
    vy = 0,
    ax = 0,
    ay = 0,
    expires = 0,
    style = {
      color: "blue"
    }
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vx = vx;
    this.vy = vy;
    this.ax = ax;
    this.ay = ay;
    this.expires = expires;
    this.style = style;
    this.expired = false;
  }

  render(context) {
    if (!this.expired) {
      context.fillStyle = this.style.color;
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}

export default Particle;
