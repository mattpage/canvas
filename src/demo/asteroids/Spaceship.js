import { PolygonEntity } from "../../index";

export const SpaceshipType = Object.freeze({
  EnemySaucer: "EnemySaucer",
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
  {
    type: SpaceshipType.EnemySaucer,
    points: [
      2.5, 5,
      5, 2.5,
      5, 0,
      10, 0,
      15, -5,
      10, -10,
      -10, -10,
      -15, -5,
      -10, 0,
      -5, 0,
      -5, 2.5,
      -2.5, 5
    ].map(num => num * -1),
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

  get shieldsEnabled() {
    return this.polygon.options("showCircle");
  }

  set shieldsEnabled(enabled) {
    this.polygon.options.showCircle = enabled;
  }
}

export default Spaceship;
