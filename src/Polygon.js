class Polygon {
  static defaultOptions = { showRect: false, showOffset: false };

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
      right = x;
      left = x;
      top = y;
      bottom = y;
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

  rotate(degrees) {
    const angle = (degrees * Math.PI) / 180.0;
    let x;
    let y;
    let x1;
    let y1;
    const rotated = [];
    const points = this.points.slice(0);
    while (points.length) {
      x = points.shift();
      y = points.shift();
      x1 = x * Math.cos(angle) - y * Math.sin(angle);
      y1 = x * Math.sin(angle) + y * Math.cos(angle);
      rotated.push(x1, y1);
    }
    this.points = rotated;
  }

  render(context, offset, color = "black") {
    const points = this.points.slice(0);
    if (offset) {
      context.save();
      if (offset) {
        context.translate(offset.x, offset.y);
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
    context.strokeStyle = color;
    context.stroke();

    if (this.options.showRect) {
      // draw the bounding rect
      const rc = this.rect;
      context.strokeRect(
        rc.left,
        rc.top,
        rc.right - rc.left,
        rc.bottom - rc.top
      );
    }

    if (offset) {
      context.restore();

      if (this.options.showOffset) {
        // draw the x,y coordinates
        const { x, y } = offset;
        context.strokeText(`(${x},${y})`, x, y);
      }
    }
  }
}

export default Polygon;
