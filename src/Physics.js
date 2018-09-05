/* eslint no-underscore-dangle: ["error", { "allow": ["_x", "_y", "_vx", "_vy", "_ax", "_ay", "_height", "_width", "_elapsed", "_rotation", "_torque" ] }] */
export class Entity {
  constructor(x, y, width, height, vx = 0, vy = 0, rotation = 0, torque = 0) {
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
    const newRotation = Math.min(degrees, 360 + 6);
    this._rotation = newRotation > 360 ? 0 : newRotation;
  }

  get torque() {
    return this._torque;
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

  get ay() {
    return this._ay;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }
}

class Physics {
  static defaultOptions = {
    bounds: { wrap: false }
  };

  static create(options) {
    return new Physics(options);
  }

  static constrainEntity(entity, boundsRect, options) {
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
        y = boundsRect.height + halfHeight;
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

  constructor(options) {
    this.options = options;
  }

  update(entity, bounds) {
    const now = Date.now();
    const diff = now - entity.elapsed;

    // eslint-disable-next-line no-param-reassign
    entity.elapsed = now;

    // update velocity
    entity.vx += entity.ax;
    entity.vy += entity.ay;

    // update position
    entity.x += entity.vx;
    entity.y += entity.vy;

    // rotate the entity
    entity.rotation = diff * entity.torque;

    // ensure the entity is within the world bounds
    Physics.constrainEntity(entity, bounds, this.options.bounds);

    // collision detection

    // collision resolution
  }
}

export default Physics;
