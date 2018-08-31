/* eslint no-underscore-dangle: ["error", { "allow": ["_position", "_height", "_width" ] }] */
export class Entity {
  constructor(x, y, width, height) {
    this._position = { x, y };
    this._width = width;
    this._height = height;

    // this.torue = 0.0;
    // this._velocity = {
    //   x: 0.0,
    //   y: 0.0
    // };
  }

  get position() {
    return Object.assign({}, this._position);
  }

  set position(pos) {
    this._position.x = pos.x;
    this._position.y = pos.y;
  }

  get height() {
    return this._height;
  }

  get width() {
    return this._width;
  }

  move(x, y) {
    this._position = { x, y };
  }

  offset(xDelta = 0, yDelta = 0) {
    this._position.x += xDelta;
    this._position.y += yDelta;
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
    const pos = entity.position;

    if (wrap) {
      // off right edge
      if (pos.x - halfWidth > boundsRect.right) {
        pos.x = boundsRect.left - halfWidth;
      }

      // off left edge
      if (pos.x + halfWidth < boundsRect.left) {
        pos.x = boundsRect.right + halfWidth;
      }

      // off bottom edge
      if (pos.y - halfHeight > boundsRect.bottom) {
        pos.y = boundsRect.top - halfHeight;
      }

      // off top edge
      if (pos.y + halfHeight < boundsRect.top) {
        pos.y = boundsRect.height + halfHeight;
      }
    } else {
      // off right edge
      if (pos.x + entity.width > boundsRect.right) {
        pos.x = boundsRect.right - entity.width;
      }

      // off left edge
      if (pos.x < boundsRect.left) {
        pos.x = boundsRect.left;
      }

      // off bottom edge
      if (pos.y + entity.height > boundsRect.bottom) {
        pos.y = boundsRect.bottom - entity.height;
      }

      // off top edge
      if (pos.y < boundsRect.top) {
        pos.y = boundsRect.top;
      }
    }

    /* eslint-disable-next-line no-param-reassign */
    entity.position = pos;
  }

  constructor(options) {
    this.options = options;
  }

  update(entity, bounds) {
    // calc new position
    entity.offset(1, 1);

    // rotate the entity
    entity.rotate(entity.rotation + 1);

    // ensure the entity is within the world bounds
    Physics.constrainEntity(entity, bounds, this.options.bounds);

    // collision detection

    // collision resolution
  }
}

export default Physics;
