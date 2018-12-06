import Vector from "../Vector";

describe("Vector", () => {
  it("should construct", () => {
    const v = new Vector(0, 0);
    expect(v).toBeInstanceOf(Vector);
  });

  it("should have reasonable default values", () => {
    const v = new Vector();
    expect(v.x).toEqual(0);
    expect(v.y).toEqual(0);
  });

  describe("add", () => {
    it("should add a vector to vector", () => {
      const v = new Vector(1, 2);
      v.add(new Vector(3, 4));
      expect(v.x).toEqual(4);
      expect(v.y).toEqual(6);
    });
    it("should add numbers to a vector", () => {
      const v = new Vector(1, 2);
      v.add(3, 4);
      expect(v.x).toEqual(4);
      expect(v.y).toEqual(6);
    });
  });

  describe("subtract", () => {
    it("should subtract a vector from a vector", () => {
      const v = new Vector(3, 1);
      v.subtract(new Vector(1, 2));
      expect(v.x).toEqual(2);
      expect(v.y).toEqual(-1);
    });
    it("should subtract numbers from a vector", () => {
      const v = new Vector(3, 2);
      v.subtract(1, 2);
      expect(v.x).toEqual(2);
      expect(v.y).toEqual(0);
    });
  });

  describe("multiply", () => {
    it("should multiply a vector by a scalar", () => {
      const v = new Vector(2, 6);
      v.multiply(2);
      expect(v.x).toEqual(4);
      expect(v.y).toEqual(12);
    });
  });

  describe("divide", () => {
    it("should divide a vector by a scalar", () => {
      const v = new Vector(4, 6);
      v.divide(2);
      expect(v.x).toEqual(2);
      expect(v.y).toEqual(3);
    });
    it("should do nothing if you try to divide a vector by zero", () => {
      const v = new Vector(4, 6);
      v.divide(0);
      expect(v.x).toEqual(4);
      expect(v.y).toEqual(6);
    });
  });

  describe("magnitude", () => {
    it("should calculate the magnitude of the vector", () => {
      const v = new Vector(3, 4);
      expect(v.magnitude).toEqual(5);
    });
  });

  describe("normalize", () => {
    it("should reduce the magnitude of this vector to 1", () => {
      const v = new Vector(3, 4);
      const { x, y, magnitude } = v;
      v.normalize();
      expect(v.magnitude).toEqual(1);
      expect(v.x).toEqual(x / magnitude);
      expect(v.y).toEqual(y / magnitude);
    });
  });

  describe("clone", () => {
    it("should return a copy of a vector", () => {
      const v1 = Vector.create(42, 24);
      const v2 = v1.clone();
      expect(v2).toBeInstanceOf(Vector);
      expect(v1.x).toEqual(v2.x);
      expect(v1.y).toEqual(v2.y);
    });
  });

  describe("Vector.create", () => {
    it("should create", () => {
      const v = Vector.create();
      expect(v).toBeInstanceOf(Vector);
    });
  });

  describe("Vector.add", () => {
    it("should add two vectors", () => {
      const v = Vector.add(Vector.create(1, 2), Vector.create(3, 4));
      expect(v.x).toEqual(4);
      expect(v.y).toEqual(6);
    });
  });

  describe("Vector.subtract", () => {
    it("should subtract two vectors", () => {
      const v = Vector.subtract(Vector.create(3, 1), Vector.create(1, 2));
      expect(v.x).toEqual(2);
      expect(v.y).toEqual(-1);
    });
  });
  describe("Vector.multiply", () => {
    it("should multiply a vector", () => {
      const v = Vector.multiply(Vector.create(2, 6), 2);
      expect(v.x).toEqual(4);
      expect(v.y).toEqual(12);
    });
  });
  describe("Vector.divide", () => {
    it("should divide a vector", () => {
      const v = Vector.divide(Vector.create(4, 6), 2);
      expect(v.x).toEqual(2);
      expect(v.y).toEqual(3);
    });
  });
});
