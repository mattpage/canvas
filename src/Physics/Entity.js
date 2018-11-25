import Vector from "./Vector";

class Entity {
  static create(...args) {
    return new Entity(...args);
  }

  constructor(
    location,
    width = 0,
    height = 0,
    velocity,
    rotation = 0,
    torque = 0
  ) {
    this._location = location || new Vector(0, 0);
    this._velocity = velocity || new Vector(0, 0);
    this._acceleration = new Vector(0.0, 0.0);
    this._width = width;
    this._height = height;
    this._rotation = rotation;
    this._torque = torque;
    this._expires = null;
    this._collidesWith = {};
    this._onCollision = null;
  }

  get collidesWith() {
    return this._collidesWith;
  }

  set collidesWith(mapOfTypes) {
    this._collidesWith = mapOfTypes;
  }

  get onCollision() {
    return this._onCollision;
  }

  set onCollision(callback) {
    this._onCollision = callback;
  }

  get type() {
    return this._type;
  }

  set type(t) {
    this._type = t;
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

  get location() {
    return this._location;
  }

  set location(vector) {
    this._location = vector;
  }

  get velocity() {
    return this._velocity;
  }

  set velocity(vector) {
    this._velocity = vector;
  }

  get acceleration() {
    return this._acceleration;
  }

  set acceleration(vector) {
    this._acceleration = vector;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get rect() {
    const { location, width, height } = this;
    return {
      top: location.y,
      left: location.x,
      right: location.x + width,
      bottom: location.y + height
    };
  }

  collision(entities) {
    // Given an array of colliding entities, this method must return a new array of resulting entities (if any).
    // By default, this checks to see if any of the entity types can collide with this entity.
    // If so, this entity is destroyed.
    const { collidesWith, onCollision } = this;
    const collisions = entities.reduce((acc, entity) => {
      if (collidesWith[entity.type]) {
        acc.push(entity);
      }
      return acc;
    }, []);
    if (collisions.length > 0) {
      if (onCollision) {
        onCollision(collisions);
      }
      return [];
    }

    return [this];
  }
}

export default Entity;
