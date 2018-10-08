/* eslint no-underscore-dangle: ["error", { "allow": ["_size"] }] */
import {
  Physics,
  PolygonEntity,
  numberInRange,
  integerInRange
} from "../../index";

const logger = console;

export const AsteroidSize = Object.freeze({
  Large: 4,
  Medium: 3,
  Small: 2,
  Tiny: 1
});

// asteroids in cartesian points
/* prettier-ignore */
export const ASTEROIDS = [
  {
    size: AsteroidSize.Large,
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
    size: AsteroidSize.Large,
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
    size: AsteroidSize.Medium,
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
    size: AsteroidSize.Medium,
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
    size: AsteroidSize.Small,
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
    size: AsteroidSize.Small,
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
    size: AsteroidSize.Small,
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
    size: AsteroidSize.Tiny,
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
    size: AsteroidSize.Tiny,
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
  static createRandom(x, y, size, options = {}) {
    let asteroids = ASTEROIDS;
    if (size) {
      asteroids = asteroids.filter(a => a.size === size);
    }
    const index = integerInRange(0, asteroids.length - 1);
    const velX = numberInRange(0.001, 0.5);
    const velY = numberInRange(0.001, 0.5);
    const rotation = numberInRange(1, 360);
    const torque = numberInRange(0.00001, 0.0005);
    return new Asteroid(
      asteroids[index].points,
      asteroids[index].size,
      x,
      y,
      velX,
      velY,
      rotation,
      torque,
      options
    );
  }

  static split(asteroid, newSize, offset) {
    const a1 = Asteroid.createRandom(asteroid.x, asteroid.y, newSize);
    const a2 = Asteroid.createRandom(
      asteroid.x + offset,
      asteroid.y + offset,
      newSize
    );

    const vectors = Physics.splitVelocityVector(asteroid.vx, asteroid.vy);
    a1.vx = vectors[0].vx;
    a1.vy = vectors[0].vy;
    a2.vx = vectors[1].vx;
    a2.vy = vectors[1].vy;
    return [a1, a2];
  }

  constructor(points, size, x, y, velX, velY, rotation, torque) {
    super(points, x, y, velX, velY, rotation, torque);
    this.velX = velX;
    this.velX = velX;
    this._size = size;
  }

  get size() {
    return this._size;
  }

  collision() {
    const result = [];

    switch (this.size) {
      case AsteroidSize.Tiny:
        // when a tiny asteroid collides, it is destroyed. don't replace it or render it
        break;
      case AsteroidSize.Small:
        // when a small asteroid collides, it is replaced with two tiny asteroids
        result.push(...Asteroid.split(this, AsteroidSize.Tiny, 10));
        break;

      case AsteroidSize.Medium:
        // when a medium asteroid collides, it is replaced with two small asteroids
        result.push(...Asteroid.split(this, AsteroidSize.Small, 20));
        break;

      case AsteroidSize.Large:
        // when a large asteroid collides, it is replaced with two medium asteroids
        result.push(...Asteroid.split(this, AsteroidSize.Medium, 40));
        break;

      default:
        logger.warn("unknown asteroid size", this.size);
        break;
    } // end switch
    return result;
  }
}

export default Asteroid;
