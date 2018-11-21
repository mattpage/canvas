class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // add a vector to this vector
  add(v) {
    this.x += v.x;
    this.y += v.y;
  }

  // subtract a vector from this vector
  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
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
