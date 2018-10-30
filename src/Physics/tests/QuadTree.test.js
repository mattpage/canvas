import QuadTree from "../QuadTree";

describe("QuadTree", () => {
  describe("constructor", () => {
    it("should construct", () => {
      expect(
        new QuadTree({ x: 0, y: 0, width: 100, height: 100 })
      ).toBeInstanceOf(QuadTree);
    });
  });
  describe("bounds", () => {
    it("should return the boundaries of the quadtree", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      expect(qt.bounds).toEqual(bounds);
    });
  });
  describe("level", () => {
    it("should return the level of the quadtree", () => {
      const qt = new QuadTree({ x: 0, y: 0, width: 100, height: 100 }, 1);
      expect(qt.level).toEqual(1);
    });
  });
});
