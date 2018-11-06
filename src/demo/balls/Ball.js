import { Entity, numberInRange, randomColor } from "../../index";

class Ball extends Entity {
  static createRandom(x = 0, y = 0) {
    const vx = numberInRange(0.001, 2.5);
    const temp = numberInRange(0.001, 1);
    const vy = temp === vx ? vx + numberInRange(0.001, 1) : temp;
    const radius = numberInRange(5, 50);
    return new Ball(x, y, vx, vy, radius, randomColor());
  }

  constructor(x = 0, y = 0, vx = 2.5, vy = 1, radius = 25, color = "blue") {
    super(x, y, radius * 2, radius * 2, vx, vy);
    this.radius = radius;
    this.color = color;
  }

  render(context) {
    context.beginPath();
    context.arc(
      this.x + this.radius,
      this.y + this.radius,
      this.radius,
      0,
      Math.PI * 2,
      true
    );
    context.closePath();
    context.fillStyle = this.color;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();
  }
}

export default Ball;
