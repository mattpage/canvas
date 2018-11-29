/*
 * 2D Vector
*/
class Vector {
  static copy(v) {
    return Vector.create(v.x, v.y);
  }

  static add(v1, v2) {
    return Vector.create(v1.x + v2.x, v1.y + v2.y);
  }

  static subtract(v1, v2) {
    return Vector.create(v1.x - v2.x, v1.y - v2.y);
  }

  static multiply(v, scalar) {
    return Vector.copy(v).multiply(scalar);
  }

  static divide(v, scalar) {
    return Vector.copy(v).divide(scalar);
  }

  static create(...args) {
    return new Vector(...args);
  }

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  // add a vector to this vector
  add(...args) {
    const numArgs = args.length;
    if (numArgs === 1) {
      const v = args[0];
      this.x += v.x;
      this.y += v.y;
    } else if (numArgs === 2) {
      this.x += args[0];
      this.y += args[1];
    }
    return this;
  }

  clone() {
    return Vector.create(this.x, this.y);
  }

  // subtract a vector from this vector
  subtract(...args) {
    const numArgs = args.length;
    if (numArgs === 1) {
      const v = args[0];
      this.x -= v.x;
      this.y -= v.y;
    } else if (numArgs === 2) {
      this.x -= args[0];
      this.y -= args[1];
    }
    return this;
  }

  // increase the length (magnitude) of a vector
  // without changing direction
  // AKA scale a vector
  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  // decrease the length (magnitude) of a vector
  // without changing direction
  // AKA scale a vector
  divide(scalar) {
    if (scalar !== 0) {
      this.x /= scalar;
      this.y /= scalar;
    }
    return this;
  }

  // the length of the vector AKA the hypotenuse of the triangle
  get magnitude() {
    // pythagorean theorem
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // reduce this vector's length to 1 (unit vector) without changing its direction
  normalize() {
    this.divide(this.magnitude);
    return this;
  }

  // split a velocity vector into two vectors traveling apart by some number of degrees (deflection)
  split(deflectionDegrees = 30) {
    // directional recoil
    const kx = this.x < 0 ? -1 : 1;
    const ky = this.y < 0 ? -1 : 1;

    // length of the vector (hypotenuse)
    const mag = this.magnitude;

    // angle of velocity vector
    const theta = Math.atan(this.y / this.x);

    // deflect +- deflectionDegrees
    const alpha1 = (deflectionDegrees * Math.PI) / 180;
    const alpha2 = -alpha1;

    return [
      Vector.create(
        mag * Math.cos(alpha1 + theta) * kx,
        mag * Math.sin(alpha1 + theta) * ky
      ),
      Vector.create(
        mag * Math.cos(alpha2 + theta) * kx,
        mag * Math.sin(alpha2 + theta) * ky
      )
    ];
  }
}

export default Vector;
