import Vector from "../Vector";

describe("Vector", () => {
  it("should construct", () => {
    const v = new Vector(0, 0);
    expect(v).toBeInstanceOf(Vector);
  });

  describe("add", () => {
    it("should add a vector to vector", () => {
      const v = new Vector(1, 2);
      v.add(new Vector(3, 4));
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
  });

  describe("magnitude", () => {
    it("should have some tests", () => {});
  });

  describe("normalize", () => {
    it("should have some tests", () => {});
  });
});
