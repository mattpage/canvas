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

  describe("nodes and objects", () => {
    it("should return an empty collection of nodes and an empty collection of objects", () => {
      const qt = new QuadTree();
      expect(qt.nodes).toEqual([]);
      expect(qt.objects).toEqual([]);
    });
    it("should return an empty node collection while inserted object count does not exceed maxObjects", () => {
      const qt = new QuadTree();
      const newObjects = [
        { x: 0, y: 0, width: 5, height: 5 },
        { x: 20, y: 20, width: 5, height: 5 },
        { x: 30, y: 30, width: 5, height: 5 },
        { x: 40, y: 40, width: 5, height: 5 },
        { x: 50, y: 50, width: 5, height: 5 },
        { x: 60, y: 60, width: 5, height: 5 },
        { x: 70, y: 70, width: 5, height: 5 },
        { x: 80, y: 80, width: 5, height: 5 },
        { x: 90, y: 90, width: 5, height: 5 }
      ];
      newObjects.forEach(obj => qt.insert(obj));
      expect(qt.nodes).toEqual([]);
      expect(qt.objects).toEqual(newObjects);
    });
    it("should split and return a collection of 4 nodes when the inserted object count exceeds maxObjects", () => {
      const qt = new QuadTree();
      const newObjects = [
        { x: 0, y: 0, width: 5, height: 5 },
        { x: 10, y: 10, width: 5, height: 5 },
        { x: 20, y: 20, width: 5, height: 5 },
        { x: 30, y: 30, width: 5, height: 5 },
        { x: 40, y: 40, width: 5, height: 5 },
        { x: 44, y: 44, width: 5, height: 5 },
        { x: 60, y: 60, width: 5, height: 5 },
        { x: 60, y: 65, width: 5, height: 5 },
        { x: 70, y: 70, width: 5, height: 5 },
        { x: 80, y: 80, width: 5, height: 5 },
        { x: 90, y: 90, width: 5, height: 5 }
      ];
      newObjects.forEach(obj => qt.insert(obj));
      expect(qt.objects).toEqual([]);
      expect(qt.nodes).toHaveLength(4);
    });
  });
});
