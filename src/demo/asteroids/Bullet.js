import { PolygonEntity } from "../../index";

export const BulletType = Object.freeze({
  Enemy: "EnemyBullet",
  Player: "PlayerBullet"
});

// various bullets in cartesian points
/* prettier-ignore */
export const BULLETS = [
  {
    name: 'cross',
    type: BulletType.Enemy,
    points: [
      5, 0,
      5, 2.5,
      2.5, 2.5,
      2.5, 5,
      0, 5,
      -2.5, 5
      -2.5, 2.5,
      -5, 2.5,
      -5, 0,
      -5, -2.5,
      -2.5, -2.5,
      -2.5, -5,
      0, -5,
      2.5, -5,
      2.5, -2.5,
      5, -2.5,
      5, 0,
    ],
  },
  {
    name: 'diamond',
    type: BulletType.Player,
    points: [
      2.5, 0,
      0, 2.5,
      -2.5, 0,
      0, -2.5,
    ],
  },
]

class Bullet extends PolygonEntity {
  static create(type = BulletType.Player, ...args) {
    const bullets = BULLETS.filter(s => s.type === type);
    const bullet = new Bullet(bullets[0].points, ...args);
    bullet.type = type;
    return bullet;
  }
}

export default Bullet;
