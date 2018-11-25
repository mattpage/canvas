class Vector {
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
  }

  // increase the length (magnitude) of a vector
  // without changing direction
  // AKA scale a vector
  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
  }

  // decrease the length (magnitude) of a vector
  // without changing direction
  // AKA scale a vector
  divide(scalar) {
    if (scalar !== 0) {
      this.x /= scalar;
      this.y /= scalar;
    }
  }

  // the length of the vector AKA the hypotenuse of the triangle
  get magnitude() {
    // pythagorean theorem
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // reduce this vector's length to 1 (unit vector) without changing its direction
  normalize() {
    this.divide(this.magnitude);
  }
}

export default Vector;
