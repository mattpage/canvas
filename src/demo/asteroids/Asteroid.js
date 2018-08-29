/* eslint no-underscore-dangle: ["error", { "allow": ["_polygon", "_position", "_rotation"] }] */
import { Polygon, numberInRange } from "../../index";

class Asteroid {
  // asteroids in cartesian points
  /* prettier-ignore */
  static ASTEROIDS = [
    [
      0, 20,
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
    [
      0, 20,
      20, 0,
      20, -10,
      0, -30,
      -10, -30,
      -20, -20,
      -30, -10,
      -30, 0,
      -20, 20
    ],
    [
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
    [
      0, 15,
      5, 10,
      10, 10,
      15, 5,
      15, 0,
      10, -5,
      5, -5,
      5, -10,
      0, -5,
      -5, -10,
      -10, -5,
      -10, 0,
      -5, 5,
      -5, 10
    ]
  ];

  static createRandom(x, y, rotation) {
    const index = numberInRange(0, Asteroid.ASTEROIDS.length - 1);
    return new Asteroid(Asteroid.ASTEROIDS[index], x, y, rotation);
  }

  constructor(points, x, y, rotation) {
    this._polygon = Polygon.create(points);
    this._position = { x: 0, y: 0 };
    if (typeof x === "number") {
      this._position.x = x;
    }
    if (typeof y === "number") {
      this._position.y = y;
    }
    this._rotation = rotation || 0;
  }

  get position() {
    return this._position;
  }

  move(x, y) {
    this._position = { x, y };
  }

  offset(xDelta = 0, yDelta = 0) {
    this._position.x += xDelta;
    this._position.y += yDelta;
  }

  get rotation() {
    return this._rotation;
  }

  rotate(degrees) {
    const newRotation = Math.min(degrees, 360 + 6);
    this._rotation = newRotation > 360 ? 0 : newRotation;
  }

  render(context) {
    this._polygon.render(context, this._position, this._rotation);
  }
}

export default Asteroid;
