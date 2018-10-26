import { PolygonEntity } from "../../index";

export const SpaceshipType = Object.freeze({
  Player: "PlayerShip"
});

// various spaceships in cartesian points
/* prettier-ignore */
export const SPACESHIPS = [
  {
    type: SpaceshipType.Player,
    points: [
      15, 0,
      0, 7.5,
      2.5, 0,
      0, -7.5,
    ],
  },
]

class Spaceship extends PolygonEntity {
  static create(
    type = SpaceshipType.Player,
    x = 0,
    y = 0,
    collidesWith = {},
    onCollision = null
  ) {
    const ships = SPACESHIPS.filter(s => s.type === type);
    const ship = new Spaceship(ships[0].points, x, y);
    ship.type = type;
    ship.collidesWith = collidesWith;
    ship.onCollision = onCollision;
    return ship;
  }
}

export default Spaceship;
