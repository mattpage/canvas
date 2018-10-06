/* eslint no-underscore-dangle: ["error", { "allow": ["_x", "_y", "_vx", "_vy", "_ax", "_ay", "_height", "_width", "_elapsed", "_rotation", "_torque", "_collisions" ] }] */
/* eslint no-param-reassign: ["error", { "props": false }] */
import Polygon from "./Polygon";

export class Entity {
  static create(...args) {
    return new Entity(...args);
  }

  constructor(
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    vx = 0,
    vy = 0,
    rotation = 0,
    torque = 0
  ) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._rotation = rotation;
    this._torque = torque;

    this._elapsed = Date.now();

    // velocity
    this._vx = vx;
    this._vy = vy;

    // acceleration
    this._ax = 0.0;
    this._ay = 0.0;

    this._collisions = [];
  }

  get collisions() {
    return this._collisions;
  }

  set collisions(indexArray) {
    this._collisions = indexArray;
  }

  get elapsed() {
    return this._elapsed;
  }

  set elapsed(ms) {
    this._elapsed = ms;
  }

  get rotation() {
    return this._rotation;
  }

  set rotation(degrees) {
    let newRotation = degrees;
    if (newRotation >= 360) {
      newRotation = 0;
    } else if (newRotation <= -360) {
      newRotation = 0;
    }
    this._rotation = newRotation;
  }

  get torque() {
    return this._torque;
  }

  set torque(t) {
    this._torque = t;
  }

  get x() {
    return this._x;
  }

  set x(x) {
    this._x = x;
  }

  get y() {
    return this._y;
  }

  set y(y) {
    this._y = y;
  }

  get vx() {
    return this._vx;
  }

  set vx(vx) {
    this._vx = vx;
  }

  get vy() {
    return this._vy;
  }

  set vy(vy) {
    this._vy = vy;
  }

  get ax() {
    return this._ax;
  }

  set ax(ax) {
    this._ax = ax;
  }

  get ay() {
    return this._ay;
  }

  set ay(ay) {
    this._ay = ay;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get rect() {
    return {
      top: this.y,
      left: this.x,
      right: this.x + this.width,
      bottom: this.y + this.height
    };
  }
}

export class PolygonEntity extends Entity {
  constructor(points, x, y, vx = 0, vy = 0, rotation = 0, torque = 0) {
    const polygon = Polygon.create(points, {});
    const rc = polygon.rect;
    super(
      x,
      y,
      rc.right - rc.left,
      rc.bottom - rc.top,
      vx,
      vy,
      rotation,
      torque
    );
    this.polygon = polygon;
  }

  render(context) {
    this.polygon.render(context, { x: this.x, y: this.y }, super.rotation);
  }
}

class Physics {
  static constrainEntity(entity, boundsRect, options = {}) {
    const halfWidth = entity.width / 2;
    const halfHeight = entity.height / 2;
    const { wrap } = options;
    let { x, y } = entity;

    if (wrap) {
      // off right edge
      if (x - halfWidth > boundsRect.right) {
        x = boundsRect.left - halfWidth;
      }

      // off left edge
      if (x + halfWidth < boundsRect.left) {
        x = boundsRect.right + halfWidth;
      }

      // off bottom edge
      if (y - halfHeight > boundsRect.bottom) {
        y = boundsRect.top - halfHeight;
      }

      // off top edge
      if (y + halfHeight < boundsRect.top) {
        y = boundsRect.bottom + halfHeight;
      }
    } else {
      // off right edge
      if (x + entity.width > boundsRect.right) {
        x = boundsRect.right - entity.width;
      }

      // off left edge
      if (x < boundsRect.left) {
        x = boundsRect.left;
      }

      // off bottom edge
      if (y + entity.height > boundsRect.bottom) {
        y = boundsRect.bottom - entity.height;
      }

      // off top edge
      if (y < boundsRect.top) {
        y = boundsRect.top;
      }
    }

    entity.x = x;
    entity.y = y;
  }

  /* prettier-ignore */
  static collision(a, b) {
    return !(
      a.left > b.right || // A is right of B
      a.right < b.left || // A is left of B
      a.bottom < b.top || // A is above B
      a.top > b.bottom    // A is below B
    );   
  }

  static update(entities, bounds, options = { wrap: false }) {
    const now = Date.now();

    entities.forEach(entity => {
      const diff = now - entity.elapsed;
      entity.elapsed = now;

      // update velocity
      entity.vx += entity.ax;
      entity.vy += entity.ay;

      // update position
      entity.x += entity.vx;
      entity.y += entity.vy;

      // if it has torque, rotate the entity
      const r = diff * entity.torque;
      if (r !== 0) {
        entity.rotation += r;
      }
      // ensure the entity is within the world bounds
      Physics.constrainEntity(entity, bounds, options);

      // collision detection - O(n^2) complexity
      const collisions = [];
      entities.forEach((otherEntity, otherEntityIndex) => {
        if (entity !== otherEntity) {
          if (Physics.collision(entity.rect, otherEntity.rect)) {
            collisions.push(otherEntityIndex);
          }
        }
      });
      entity.collisions = collisions;
    });
  }
}

export default Physics;
