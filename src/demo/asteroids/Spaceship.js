/* eslint no-underscore-dangle: ["error", { "allow": [ "_rotation" ] }] */
import { Entity, Polygon } from "../../index";

export const SpaceshipType = Object.freeze({
  Player: 1
});

// various spaceships in cartesian points
/* prettier-ignore */
export const SPACESHIPS = [
  {
    type: SpaceshipType.Player,
    points: [
      0, 15,
      7.5, 0,
      0, 2.5,
      -7.5, 0,
    ],
  },
]

class Spaceship extends Entity {
  static create(type = SpaceshipType.Player, x = 0, y = 0) {
    const ships = SPACESHIPS.filter(s => s.type === type);
    return new Spaceship(ships[0].points, x, y);
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
