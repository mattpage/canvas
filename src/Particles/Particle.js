class Particle {
  static create(...args) {
    return new Particle(...args);
  }

  constructor(x = 0, y = 0, vx = 0, vy = 0, ax = 0, ay = 0, color = "black") {
    this._x = x;
    this._y = y;
    this._vx = vx;
    this._vy = vy;
    this._ax = ax;
    this._ay = ay;
    this._color = color;
  }

  /*
  attract(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy); // Pythagorean theorum
    this.x += dx / distance;
    this.y += dy / distance;
  }
  */

  /*
  bounce(dim) {
    if (this.y > dim.height) {
      this.oldY = dim.height;
      this.y = this.oldY - this.vy * 0.3;
    }
  }
  */

  render(context) {
    context.strokeStyle = "#0099ff";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(this.oldX, this.oldY);
    context.lineTo(this.x, this.y);
    context.stroke();
  }
}

export default Particle;
