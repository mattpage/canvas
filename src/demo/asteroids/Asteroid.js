/* eslint no-underscore-dangle: ["error", { "allow": ["_polygon", "_position", "_rotation"] }] */
import { Entity, Polygon, numberInRange } from "../../index";

class Asteroid extends Entity {
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
    const polygon = Polygon.create(points);
    const rc = polygon.rect;
    super(x, y, rc.right - rc.left, rc.bottom - rc.top);
    this._polygon = polygon;
    this._rotation = rotation || 0;
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
