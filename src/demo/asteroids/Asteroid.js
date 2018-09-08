import { Entity, Polygon, numberInRange, integerInRange } from "../../index";

const AsteroidSize = Object.freeze({
  Large: 3,
  Medium: 2,
  Small: 1
});

class Asteroid extends Entity {
  // asteroids in cartesian points
  /* prettier-ignore */
  static ASTEROIDS = [
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
      size: AsteroidSize.Small,
      points: [
        0, 10,
        5, 10,
        10, 10,
        10, 5,
        10, 0,
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
    }
  ]; 

  static createRandom(x, y, options = {}) {
    const index = integerInRange(0, Asteroid.ASTEROIDS.length);
    const velX = numberInRange(0.001, 0.5);
    const velY = numberInRange(0.001, 0.5);
    const rotation = numberInRange(1, 360);
    const torque = numberInRange(0.01, 0.1);
    return new Asteroid(
      Asteroid.ASTEROIDS[index].points,
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

  set rotation(degrees) {
    const newRotation = Math.min(degrees, 360 + 6);
    this._rotation = newRotation > 360 ? 0 : newRotation;
    this.polygon.rotate(this._rotation);
  }

  render(context) {
    this.polygon.render(context, { x: this.x, y: this.y }, this.color);
  }
}

export default Asteroid;
