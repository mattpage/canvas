/* eslint no-underscore-dangle: ["error", { "allow": ["_size", "_rotation"] }] */
import { Entity, Polygon, numberInRange, integerInRange } from "../../index";

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

class Asteroid extends Entity {
  static createRandom(x, y, size, options = {}) {
    let asteroids = ASTEROIDS;
    if (size) {
      asteroids = asteroids.filter(a => a.size === size);
    }
    const index = integerInRange(0, asteroids.length - 1);
    const velX = numberInRange(0.001, 0.5);
    const velY = numberInRange(0.001, 0.5);
    const rotation = numberInRange(1, 360);
    const torque = numberInRange(0.01, 0.1);
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

  constructor(points, size, x, y, velX, velY, rotation, torque, options = {}) {
    const polygon = Polygon.create(points, options);
    const rc = polygon.rect;
    super(
      x,
      y,
      rc.right - rc.left,
      rc.bottom - rc.top,
      velX,
      velY,
      rotation,
      torque
    );
    this.polygon = polygon;
    this._size = size;
  }

  get size() {
    return this._size;
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

export default Asteroid;
