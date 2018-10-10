import { PolygonEntity } from "../../index";

export const BulletType = Object.freeze({
  Diamond: 1
});

// various bullets in cartesian points
/* prettier-ignore */
export const BULLETS = [
  {
    type: BulletType.Diamond,
    points: [
      2.5, 0,
      0, 2.5,
      -2.5, 0,
      0, -2.5,
    ],
  },
]

class Bullet extends PolygonEntity {
  static create(type = BulletType.Diamond, x = 0, y = 0, ...args) {
    const bullets = BULLETS.filter(s => s.type === type);
    return new Bullet(bullets[0].points, x, y, ...args);
  }
}

export default Bullet;
