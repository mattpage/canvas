import {
  Physics,
  PolygonEntity,
  numberInRange,
  integerInRange
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
  static createRandom(x, y, type, options = {}) {
    let asteroids = ASTEROIDS;
    if (type) {
      asteroids = asteroids.filter(a => a.type === type);
    }
    const index = integerInRange(0, asteroids.length - 1);
    const velX = numberInRange(0.001, 0.5);
    const velY = numberInRange(0.001, 0.5);
    const rotation = numberInRange(1, 360);
    const torque = numberInRange(0.00001, 0.0005);
    return new Asteroid(
      asteroids[index].points,
      asteroids[index].type,
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

  constructor(points, type, x, y, velX, velY, rotation, torque) {
    super(points, x, y, velX, velY, rotation, torque);
    this.velX = velX;
    this.velX = velX;
    this.type = type;
  }

  collision() {
    const result = [];

    switch (this.type) {
      case AsteroidType.Tiny:
        // when a tiny asteroid collides, it is destroyed. don't replace it or render it
        break;
      case AsteroidType.Small:
        // when a small asteroid collides, it is replaced with two tiny asteroids
        result.push(...Asteroid.split(this, AsteroidType.Tiny, 10));
        break;

      case AsteroidType.Medium:
        // when a medium asteroid collides, it is replaced with two small asteroids
        result.push(...Asteroid.split(this, AsteroidType.Small, 20));
        break;

      case AsteroidType.Large:
        // when a large asteroid collides, it is replaced with two medium asteroids
        result.push(...Asteroid.split(this, AsteroidType.Medium, 40));
        break;

      default:
        logger.warn("unknown asteroid type", this.type);
        break;
    } // end switch
    return result;
  }
}

export default Asteroid;
