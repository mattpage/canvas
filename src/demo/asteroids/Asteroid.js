import { Entity, Polygon, numberInRange, integerInRange } from "../../index";

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

  static createRandom(x, y, options = {}) {
    const index = integerInRange(0, Asteroid.ASTEROIDS.length - 1);
    const velX = numberInRange(0.001, 0.5);
    const velY = numberInRange(0.001, 0.5);
    const rotation = numberInRange(1, 360);
    const torque = numberInRange(0.01, 0.1);
    return new Asteroid(
      Asteroid.ASTEROIDS[index],
      x,
      y,
      velX,
      velY,
      rotation,
      torque,
      options
    );
  }

  constructor(points, x, y, velX, velY, rotation, torque, options = {}) {
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
  }

  render(context) {
    this.polygon.rotate(this.rotation);
    this.polygon.render(context, { x: this.x, y: this.y });
  }
}

export default Asteroid;
