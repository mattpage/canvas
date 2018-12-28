import { PolygonEntity, integerInRange } from "../../index";
import Debris from "./Debris";

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
    location,
    collidesWith = {},
    onCollision = null
  ) {
    const ships = SPACESHIPS.filter(s => s.type === type);
    const ship = new Spaceship(ships[0].points, type, location);
    ship.collidesWith = collidesWith;
    ship.onCollision = onCollision;
    return ship;
  }

  constructor(points, type, location, velocity, rotation, torque) {
    super(points, location, velocity, rotation, torque);
    this.type = type;
  }

  shieldsUp(timeoutMs = 2000) {
    this.shieldsEnabled = true;
    setTimeout(() => {
      this.shieldsEnabled = false;
    }, timeoutMs);
  }

  get shieldsEnabled() {
    return this.polygon.options("showCircle");
  }

  set shieldsEnabled(enabled) {
    this.polygon.options.showCircle = enabled;
    if (enabled) {
      this.oldCollidesWith = this.collidesWith;
      this.collidesWith = {};
    } else if (this.oldCollidesWith) {
      this.collidesWith = this.oldCollidesWith;
    }
  }

  collision(collisions) {
    const results = super.collision(collisions);
    if (results.length < 1) {
      // this means the ship was destroyed
      // here we insert some debris into the results array
      const numDebris = integerInRange(4, 12);
      for (let i = 0; i < numDebris; ++i) {
        results.push(
          Debris.create(
            null,
            this.location.clone(),
            this.velocity.clone(),
            this.onCollision
          )
        );
      }
    }
    return results;
  }
}

export default Spaceship;
