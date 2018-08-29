class Polygon {
  static defaultOptions = {
    drawRect: false
  };

  static create(points, options) {
    return new Polygon(points, options);
  }

  constructor(points = [], options = Polygon.defaultOptions) {
    this.points = points;
    this.options = options;
  }

  get rect() {
    let left = 0;
    let right = 0;
    let top = 0;
    let bottom = 0;

    let x;
    let y;

    const points = this.points.slice(0);
    if (points.length > 2) {
      x = points.shift();
      y = points.shift();
      right = left = x;
      top = bottom = y;
    }
    while (points.length) {
      x = points.shift();
      y = points.shift();
      if (x > right) {
        right = x;
      }
      if (x < left) {
        left = x;
      }
      if (y < top) {
        top = y;
      }
      if (y > bottom) {
        bottom = y;
      }
    }
    return {
      top,
      left,
      bottom,
      right
    };
  }

  render(context, offset, rotation) {
    const points = this.points.slice(0);

    if (offset || rotation) {
      context.save();
      if (offset) {
        context.translate(offset.x, offset.y);
      }
      if (rotation) {
        context.rotate((Math.PI / 180) * rotation);
      }
    }

    context.beginPath();
    if (points.length > 2) {
      context.moveTo(points.shift(), points.shift());
      while (points.length) {
        context.lineTo(points.shift(), points.shift());
      }
    }
    context.closePath();
    context.stroke();

    if (this.options.drawRect) {
      // draw the bounding rect
      const rc = this.rect;
      context.strokeRect(
        rc.left,
        rc.top,
        rc.right - rc.left,
        rc.bottom - rc.top
      );
    }

    if (offset || rotation) {
      context.restore();
    }
  }
}

export default Polygon;
