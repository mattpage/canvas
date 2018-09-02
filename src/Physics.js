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

  get torque() {
    return this._torque;
  }

  rotate(degrees) {
    const newRotation = Math.min(degrees, 360 + 6);
    this._rotation = newRotation > 360 ? 0 : newRotation;
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

  get position() {
    return { x: this.x, y: this.y };
  }

  set position(point) {
    this.x = point.x;
    this.y = point.y;
  }

  get vx() {
    return this._vx;
  }

  get vy() {
    return this._vy;
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

  updatePosition() {
    // update velocity
    this._vx += this._ax;
    this._vy += this._ay;

    // update position
    this._x += this._vx;
    this._y += this._vy;
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

    // eslint-disable-next-line no-param-reassign
    entity.position = { x, y };
  }

  constructor(options) {
    this.options = options;
  }

  update(entity, bounds) {
    const now = Date.now();
    const diff = now - entity.elapsed;

    // eslint-disable-next-line no-param-reassign
    entity.elapsed = now;

    // calc new position
    entity.updatePosition();

    // rotate the entity
    const r = entity.rotation + diff * entity.torque;
    entity.rotate(r);

    // ensure the entity is within the world bounds
    Physics.constrainEntity(entity, bounds, this.options.bounds);

    // collision detection

    // collision resolution
  }
}

export default Physics;
