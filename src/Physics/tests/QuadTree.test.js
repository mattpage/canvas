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
    it("should return the default boundaries of the quadtree", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree();
      expect(qt.bounds).toEqual(bounds);
    });
    it("should return the explicit boundaries of the quadtree", () => {
      const bounds = { x: 0, y: 0, width: 200, height: 200 };
      const qt = new QuadTree(bounds);
      expect(qt.bounds).toEqual(bounds);
    });
  });
  describe("level", () => {
    it("should return the default level of the quadtree", () => {
      const qt = new QuadTree();
      expect(qt.level).toEqual(0);
    });
    it("should return the explicit level of the quadtree", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds, 1);
      expect(qt.level).toEqual(1);
    });
  });
  describe("maxLevels", () => {
    it("should return the default maxLevels of the quadtree", () => {
      const qt = new QuadTree();
      expect(qt.maxLevels).toEqual(5);
    });
    it("should return the explicit maxLevels of the quadtree", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds, 0, 10, 20);
      expect(qt.maxLevels).toEqual(20);
    });
  });
  describe("maxObjects", () => {
    it("should return the default maxObjects of the quadtree", () => {
      const qt = new QuadTree();
      expect(qt.maxObjects).toEqual(10);
    });
    it("should return the explicit maxObjects of the quadtree", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds, 0, 20);
      expect(qt.maxObjects).toEqual(20);
    });
  });
});
