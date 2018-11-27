import {
  PolygonEntity,
  numberInRange,
  integerInRange,
  Vector
} from "../../index";

const logger = console;

export const AsteroidType = Object.freeze({
  Large: "LargeAsteroid",
  Medium: "MediumAsteroid",
  Small: "SmallAsteroid",
  Tiny: "TinyAsteroid"
});

// asteroids in cartesian points
/* prettier-ignore */
export const ASTEROIDS = [
  {
    type: AsteroidType.Large,
    points: [
      0, 30,
      20, 0,
      20, -10,
      0, -30,
      -10, -30,
      -5, -15,
      -20, -30,
      -30, -10,
      -10, 0,
      -30, 0,
      -20, 20
    ],
  },
  {
    type: AsteroidType.Large,
    points: [
        0, 30,
        30, 0,
        20, -10,
        0, -30,
        -10, -30,
        -20, -20,
        -30, -10,
        -30, 0,
        -20, 30
      ],
  },
  {
    type: AsteroidType.Medium,
    points: [
      0, 10,
      5, 20,
      10, 15,
      15, 15,
      20, 10,
      20, 0,
      10, -15,
      0, -10,
      -5, -20,
      -15, -15,
      -15, -10,
      -20, -5,
      -20, 0,
      -15, 5,
      -10, 10,
      -10, 15
    ],
  },
  {
    type: AsteroidType.Medium,
    points: [
      0, 20,
      5, 20,
      10, 15,
      15, 15,
      20, 10,
      20, 0,
      10, -15,
      0, -20,
      -5, -20,
      -15, -15,
      -15, -10,
      -20, -5,
      -20, 0,
      -15, 5,
      -10, 10,
      -10, 15
    ],
  },
  {
    name: 'wobbly-em',
    type: AsteroidType.Small,
    points: [
      0, 15,
      5, 10,
      10, 10,
      15, 5,
      15, 0,
      10, -5,
      5, 0,
      5, -5,
      0, -5,
      0, -10,
      -5, -15,
      -10, -10,
      -10, -5,
      -15, -5,
      -15, 0,
      -10, 5,
      -5, 5,
      -5, 10
    ]
  },
  {
    name: 'knights-head',
    type: AsteroidType.Small,
    points: [
      0, 15,
      5, 10,
      10, 10,
      15, 5,
      15, 0,
      10, -5,
      5, -5,
      5, -10,
      0, -5,
      -5, -15,
      -10, -5,
      -15, 0,
      -5, 5,
      -5, 10
    ]
  },
  {
    name: 'ugly-muffin',
    type: AsteroidType.Small,
    points: [
      0, 10,
      5, 5,
      8, 5,
      10, 0,
      8, -5,
      10, 0,
      8, -5,
      5, -5,
      5, -10,
      0, -8,
      -5, -10,
      -10, -5,
      -10, 0,
      -5, 5,
      -5, 10
    ]
  },
  {
    name: 'idaho',
    type: AsteroidType.Tiny,
    points: [
      0, 5,
      3, 5,
      3, 3,
      5, 3,
      5, 0,
      3, -3,
      3, -5,
      0, -5,
      -3, -3,
    ]
  },
  {
    name: 'little-boulder',
    type: AsteroidType.Tiny,
    points: [
      0, 5,
      5, 3,
      5, 0,
      5, -3,
      0, -5,
      -3, -5,
      -5, 0,
      -3, 5,
    ]
  }
];

class Asteroid extends PolygonEntity {
  static createRandom(location, type, options = {}) {
    let asteroids = ASTEROIDS;
    if (type) {
      asteroids = asteroids.filter(a => a.type === type);
    }
    const index = integerInRange(0, asteroids.length - 1);
    const velocity = Vector.create(
      numberInRange(0.001, 0.05),
      numberInRange(0.001, 0.05)
    );
    const rotation = numberInRange(1, 360);
    const torque = numberInRange(0.00001, 0.0005);
    return new Asteroid(
      asteroids[index].points,
      asteroids[index].type,
      location,
      velocity,
      rotation,
      torque,
      options
    );
  }

  static split(asteroid, newSize, offset) {
    const a1 = Asteroid.createRandom(asteroid.location.clone(), newSize);
    const a2 = Asteroid.createRandom(
      Vector.create(asteroid.location.x + offset, asteroid.location.y + offset),
      newSize
    );

    const vectors = asteroid.velocity.split();
    /* eslint-disable prefer-destructuring */
    a1.velocity = vectors[0];
    a2.velocity = vectors[1];
    return [a1, a2];
  }

  constructor(points, type, location, velocity, rotation, torque) {
    super(points, location, velocity, rotation, torque);
    this.type = type;
  }

  collision() {
    const result = [];
    let collisions = 0;

    switch (this.type) {
      case AsteroidType.Tiny:
        // when a tiny asteroid collides, it is destroyed. don't replace it or render it
        collisions += 1;
        break;
      case AsteroidType.Small:
        // when a small asteroid collides, it is replaced with two tiny asteroids
        result.push(...Asteroid.split(this, AsteroidType.Tiny, 10));
        collisions += 1;
        break;

      case AsteroidType.Medium:
        // when a medium asteroid collides, it is replaced with two small asteroids
        result.push(...Asteroid.split(this, AsteroidType.Small, 20));
        collisions += 1;
        break;

      case AsteroidType.Large:
        // when a large asteroid collides, it is replaced with two medium asteroids
        result.push(...Asteroid.split(this, AsteroidType.Medium, 40));
        collisions += 1;
        break;

      default:
        logger.warn("unknown asteroid type", this.type);
        break;
    } // end switch

    if (collisions > 0 && this.onCollision) {
      this.onCollision();
    }
    return result;
  }
}

export default Asteroid;
