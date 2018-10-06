import Polygon from "../Polygon";

describe("Polygon", () => {
  const testPoints = [1, 2, 3, 4, 5, 6, 7, 8];

  it("should construct", () => {
    const poly = new Polygon(testPoints);
    expect(poly).toBeInstanceOf(Polygon);
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

  describe("render", () => {
    // TODO it should have some tests
  });
});
