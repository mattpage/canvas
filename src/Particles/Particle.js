import { Polygon, PolygonEntity } from "../index";

class Particle extends PolygonEntity {
  static create(...args) {
    return new Particle(...args);
  }

  constructor(
    points,
    location,
    velocity,
    rotation,
    torque,
    style = {
      fillStyle: "blue"
    }
  ) {
    super(points, location, velocity, rotation, torque, {
      ...Polygon.defaultOptions,
      ...style
    });
    this.style = style;
  }

  render(context) {
    if (!this.expired) {
      super.render(context);
    }
  }
}

export default Particle;
