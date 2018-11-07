import Polygon from "../Polygon";

describe("Polygon", () => {
  const testPoints = [1, 2, 3, 4, 5, 6, 7, 8];

  it("should construct", () => {
    const poly = new Polygon(testPoints);
    expect(poly).toBeInstanceOf(Polygon);
  });

  describe("arrayOfPointArrays", () => {
    it("should return an array of point arrays", () => {
      const poly = new Polygon(testPoints);
      expect(poly.arrayOfPointArrays).toEqual([[1, 2], [3, 4], [5, 6], [7, 8]]);
    });

    it("should cache the point array", () => {
      const poly = new Polygon(testPoints);
      expect(poly._pointArrays).toBeUndefined();
      const arr = poly.arrayOfPointArrays;
      expect(poly._pointArrays).toEqual(arr);
      poly._pointArrays = [1, 2, 3, 4, 5, 6];
      const cached = poly.arrayOfPointArrays;
      expect(poly._pointArrays).toEqual(cached);
    });
  });

  describe("rect", () => {
    it("should return a bounding rectangle", () => {
      const poly = new Polygon(testPoints);
      const rc = poly.rect;
      expect(rc).toEqual({ top: 2, left: 1, bottom: 8, right: 7 });
    });
  });

  describe("create", () => {
    it("should return a Polygon instance", () => {
      expect(Polygon.create(testPoints)).toBeInstanceOf(Polygon);
    });
  });

  describe("centroid", () => {
    it("should return the center point", () => {
      let poly = Polygon.create(testPoints);
      expect(poly.centroid).toEqual([4, 5]);
      poly = Polygon.create([0, 0, 0, 50, 50, 0, 50, 50]);
      expect(poly.centroid).toEqual([25, 25]);
    });
  });

  describe("render", () => {
    // TODO it should have some tests
  });
});
