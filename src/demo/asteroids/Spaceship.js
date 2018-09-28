/* eslint no-underscore-dangle: ["error", { "allow": [ "_rotation" ] }] */
import { Entity, Polygon } from "../../index";

class Spaceship extends Entity {
  // spaceship in cartesian points
  /* prettier-ignore */
  static SPACESHIP = {
    points: [
      0, 10,
      5, 0,
      0, 2.5,
      -5, 0,
    ],
  }

  constructor(points, x, y) {
    const polygon = Polygon.create(points, {});
    const rc = polygon.rect;
    super(x, y, rc.right - rc.left, rc.bottom - rc.top, 0, 0, 0, 0);
    this.polygon = polygon;
  }

  set rotation(degrees) {
    const newRotation = Math.min(degrees, 360 + 6);
    this._rotation = newRotation > 360 ? 0 : newRotation;
    this.polygon.rotate(this._rotation);
  }

  render(context) {
    this.polygon.render(context, { x: this.x, y: this.y });
  }
}

export default Spaceship;
