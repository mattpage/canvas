/* eslint no-underscore-dangle: ["error", { "allow": [ "_rotation" ] }] */
import { PolygonEntity } from "../../index";

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

class Spaceship extends PolygonEntity {
  static create(type = SpaceshipType.Player, x = 0, y = 0) {
    const ships = SPACESHIPS.filter(s => s.type === type);
    return new Spaceship(ships[0].points, x, y);
  }
}

export default Spaceship;
