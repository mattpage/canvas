/* eslint no-underscore-dangle: ["error", { "allow": ["_x", "_y", "_vx", "_vy", "_ax", "_ay", "_height", "_width", "_elapsed", "_rotation", "_torque", "_collisions", "_key" ] }] */
import shortid from "shortid";

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
    torque = 0,
    key = null
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

    // every entity needs a unique key
    if (!key) {
      this._key = shortid.generate();
    }
  }

  get key() {
    return this._key;
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

export default Entity;
