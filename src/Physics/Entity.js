class Entity {
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
    this._expires = null;

    // velocity
    this._vx = vx;
    this._vy = vy;

    // acceleration
    this._ax = 0.0;
    this._ay = 0.0;

    this._collidesWith = {};
  }

  get collidesWith() {
    return this._collidesWith;
  }

  set collidesWith(mapOfTypes) {
    this._collidesWith = mapOfTypes;
  }

  get type() {
    return this._type;
  }

  set type(t) {
    this._type = t;
  }

  get elapsed() {
    return this._elapsed;
  }

  set elapsed(ms) {
    this._elapsed = ms;
  }

  get expires() {
    return this._expires;
  }

  set expires(ms) {
    this._expires = ms;
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

  // eslint-disable-next-line class-methods-use-this
  collision(entities) {
    // Given an array of colliding entities, this method must return a new array of resulting entities (if any).
    // By default, this checks to see if any of the entity types can collide with this entity.
    // If so, this entity is destroyed.
    const { collidesWith } = this;
    const collisions = entities.reduce(
      (acc, entity) => (collidesWith[entity.type] ? acc + 1 : 0),
      0
    );
    return collisions > 0 ? [] : [this];
  }
}

export default Entity;
