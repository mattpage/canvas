import { Entity, numberInRange, randomColor, Vector } from "../../index";

class Ball extends Entity {
  static createRandom() {
    const vx = numberInRange(0.001, 2.5);
    const temp = numberInRange(0.001, 1);
    const vy = temp === vx ? vx + numberInRange(0.001, 1) : temp;
    const radius = numberInRange(5, 50);
    return new Ball(
      Vector.create(0, 0),
      Vector.create(vx, vy),
      radius,
      randomColor()
    );
  }

  constructor(location, velocity, radius = 25, color = "blue") {
    super(location, radius * 2, radius * 2, velocity);
    this.radius = radius;
    this.color = color;
  }

  render(context) {
    context.beginPath();
    context.arc(
      this.location.x + this.radius,
      this.location.y + this.radius,
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
