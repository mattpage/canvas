import { Entity, Vector } from "../../index";

export const SpriteDirection = Object.freeze({
  Left: "left",
  Right: "right",
  Up: "up",
  Down: "down"
});

class Sprite extends Entity {
  constructor(tiles, index, tileWidth = 32, tileHeight = 32) {
    super(Vector.create(0, 0), tileWidth, tileHeight);
    this._index = index;
    this._tiles = tiles;
    this._direction = SpriteDirection.Right;
    this._isMoving = false;
  }

  get index() {
    return this._index;
  }

  set index(n) {
    this._index = n;
  }

  get direction() {
    return this._direction;
  }

  get tiles() {
    return this._tiles.tiles;
  }

  move(constraint) {
    switch (this.direction) {
      case SpriteDirection.Left:
        this.location.x = Math.max(this.location.x - 5, constraint.left);
        break;
      case SpriteDirection.Right:
        this.location.x = Math.min(this.location.x + 5, constraint.right);
        break;
      case SpriteDirection.Up:
        this.location.y = Math.max(this.location.y - 5, constraint.top);
        break;
      case SpriteDirection.Down:
        this.location.y = Math.min(this.location.y + 5, constraint.bottom);
        break;
      default: // ignore
    }
  }

  left() {
    this._direction = SpriteDirection.Left;
    switch (this.index) {
      case 9:
        this.index = 10;
        break;
      case 10:
        this.index = 11;
        break;
      case 11:
        this.index = 9;
        break;
      default:
        this.index = 9;
        break;
    }
    return this;
  }

  right() {
    this._direction = SpriteDirection.Right;
    switch (this.index) {
      case 0:
        this.index = 1;
        break;
      case 1:
        this.index = 2;
        break;
      case 2:
        this.index = 0;
        break;
      default:
        this.index = 0;
        break;
    }
    return this;
  }

  up() {
    this._direction = SpriteDirection.Up;
    switch (this.index) {
      case 3:
        this.index = 4;
        break;
      case 4:
        this.index = 5;
        break;
      case 5:
        this.index = 3;
        break;
      default:
        this.index = 3;
        break;
    }
    return this;
  }

  down() {
    this._direction = SpriteDirection.Down;
    switch (this.index) {
      case 6:
        this.index = 7;
        break;
      case 7:
        this.index = 8;
        break;
      case 8:
        this.index = 6;
        break;
      default:
        this.index = 6;
        break;
    }
    return this;
  }

  render(context) {
    this._tiles.render(context, this._index, this.location.x, this.location.y);
  }
}

export default Sprite;
