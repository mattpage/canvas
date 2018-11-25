import { Entity } from "../index";

class Particle extends Entity {
  static create(...args) {
    return new Particle(...args);
  }

  constructor(
    location,
    width = 10,
    height = 10,
    velocity,
    rotation,
    torque,
    style = {
      color: "blue"
    }
  ) {
    super(location, width, height, velocity, rotation, torque);
    this.style = style;
  }

  render(context) {
    if (!this.expired) {
      context.fillStyle = this.style.color;
      context.fillRect(
        this.location.x,
        this.location.y,
        this.width,
        this.height
      );
    }
  }
}

export default Particle;
