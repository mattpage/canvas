class Polygon {
  static defaultOptions = {
    showRect: false,
    showCircle: false
  };

  static create(...args) {
    return new Polygon(...args);
  }

  constructor(points = [], options = Polygon.defaultOptions) {
    this.points = points;
    this.options = options;
  }

  // convert points [0,1,1,2,2,3] to [[0,1],[1,2],[2,3]]
  get arrayOfPointArrays() {
    if (this._pointArrays) {
      return this._pointArrays;
    }
    const pointArrays = [];
    const points = this.points.slice(0);
    let point = [];
    while (points.length) {
      if (point.length === 2) {
        pointArrays.push(point);
        point = [];
      } else {
        point.push(points.shift());
      }
    }
    if (point.length > 0) {
      pointArrays.push(point);
    }
    this._pointArrays = pointArrays;
    return this._pointArrays;
  }

  get centroid() {
    // TODO - refactor to not require conversion to array of arrays
    const pointArrays = this.arrayOfPointArrays;
    const pointsLen = pointArrays.length;
    return pointArrays.reduce(
      (center, point, index) => {
        center[0] += point[0];
        center[1] += point[1];
        if (index === pointsLen - 1) {
          center[0] /= pointsLen;
          center[1] /= pointsLen;
        }
        return center;
      },
      [0, 0]
    );
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

  render(context, offset, rotation) {
    const points = this.points.slice(0);
    if (offset || rotation) {
      context.save();
      if (offset) {
        context.translate(offset.x, offset.y);
      }
      if (rotation) {
        context.rotate(rotation);
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

    if (this.options.fillStyle) {
      context.fillStyle = this.options.fillStyle;
      context.fill();
    }

    context.stroke();

    if (this.options.showCircle) {
      context.beginPath();
      // draw bounding circle
      const rc = this.rect;
      const width = Math.abs(rc.right - rc.left);
      const height = Math.abs(rc.top - rc.bottom);
      const center = this.centroid;
      context.arc(
        center[0],
        center[1],
        Math.max(width, height),
        0,
        Math.PI * 2,
        true
      );
      context.closePath();
      context.stroke();
    }

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

    if (offset || rotation) {
      context.restore();
    }
  }
}

export default Polygon;
