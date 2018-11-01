import QuadTree from "../QuadTree";

describe("QuadTree", () => {
  it("should construct", () => {
    expect(
      new QuadTree({ x: 0, y: 0, width: 100, height: 100 })
    ).toBeInstanceOf(QuadTree);
  });

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

  it("should split, redistribute objects, and contain a collection of 4 nodes when the inserted object count exceeds maxObjects", () => {
    const qt = new QuadTree();
    const newObjects = [
      { x: 0, y: 0, width: 5, height: 5 },
      { x: 10, y: 10, width: 5, height: 5 },
      { x: 20, y: 20, width: 5, height: 5 },
      { x: 30, y: 30, width: 5, height: 5 },
      { x: 40, y: 40, width: 5, height: 5 },
      { x: 44, y: 44, width: 5, height: 5 },
      { x: 60, y: 0, width: 5, height: 5 },
      { x: 0, y: 60, width: 5, height: 5 },
      { x: 10, y: 70, width: 5, height: 5 },
      { x: 20, y: 80, width: 5, height: 5 },
      { x: 70, y: 20, width: 5, height: 5 },
      { x: 70, y: 70, width: 5, height: 5 },
      { x: 80, y: 80, width: 5, height: 5 },
      { x: 90, y: 90, width: 5, height: 5 }
    ];
    newObjects.forEach(obj => qt.insert(obj));
    expect(qt.objects).toEqual([]);
    expect(qt.nodes).toHaveLength(4);

    // quadrants are layed out counterclockwise
    // ---------
    // | 2 | 1 |
    // ---------
    // | 3 | 4 |
    // ---------

    // upper right quadrant
    expect(qt.nodes[0]).toBeInstanceOf(QuadTree);
    expect(qt.nodes[0].bounds).toEqual({
      x: 50,
      y: 0,
      width: 50,
      height: 50
    });
    expect(qt.nodes[0].objects).toEqual([
      { x: 60, y: 0, width: 5, height: 5 },
      { x: 70, y: 20, width: 5, height: 5 }
    ]);

    // upper left quadrant
    expect(qt.nodes[1]).toBeInstanceOf(QuadTree);
    expect(qt.nodes[1].bounds).toEqual({
      x: 0,
      y: 0,
      width: 50,
      height: 50
    });
    expect(qt.nodes[1].objects).toEqual([
      { x: 0, y: 0, width: 5, height: 5 },
      { x: 10, y: 10, width: 5, height: 5 },
      { x: 20, y: 20, width: 5, height: 5 },
      { x: 30, y: 30, width: 5, height: 5 },
      { x: 40, y: 40, width: 5, height: 5 },
      { x: 44, y: 44, width: 5, height: 5 }
    ]);

    // lower left quadrant
    expect(qt.nodes[2]).toBeInstanceOf(QuadTree);
    expect(qt.nodes[2].bounds).toEqual({
      x: 0,
      y: 50,
      width: 50,
      height: 50
    });
    expect(qt.nodes[2].objects).toEqual([
      { x: 0, y: 60, width: 5, height: 5 },
      { x: 10, y: 70, width: 5, height: 5 },
      { x: 20, y: 80, width: 5, height: 5 }
    ]);

    // lower right quadrant
    expect(qt.nodes[3]).toBeInstanceOf(QuadTree);
    expect(qt.nodes[3].bounds).toEqual({
      x: 50,
      y: 50,
      width: 50,
      height: 50
    });
    expect(qt.nodes[3].objects).toEqual([
      { x: 70, y: 70, width: 5, height: 5 },
      { x: 80, y: 80, width: 5, height: 5 },
      { x: 90, y: 90, width: 5, height: 5 }
    ]);
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

  describe("clear", () => {
    it("should clear all objects and all nodes", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      const newObjects = [
        { x: 0, y: 0, width: 5, height: 5 },
        { x: 25, y: 25, width: 5, height: 5 },
        { x: 50, y: 25, width: 5, height: 5 },
        { x: 75, y: 25, width: 5, height: 5 },
        { x: 25, y: 75, width: 5, height: 5 },
        { x: 45, y: 75, width: 5, height: 5 },
        { x: 80, y: 80, width: 5, height: 5 },
        { x: 90, y: 90, width: 5, height: 5 }
      ];
      newObjects.forEach(obj => qt.insert(obj));
      qt.clear();
      expect(qt.objects).toHaveLength(0);
    });

    it("should clear all objects and split nodes", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      const newObjects = [
        { x: 0, y: 0, width: 5, height: 5 },
        { x: 25, y: 25, width: 5, height: 5 },
        { x: 50, y: 25, width: 5, height: 5 },
        { x: 60, y: 35, width: 5, height: 5 },
        { x: 75, y: 25, width: 5, height: 5 },
        { x: 25, y: 75, width: 5, height: 5 },
        { x: 45, y: 75, width: 5, height: 5 },
        { x: 54, y: 70, width: 5, height: 5 },
        { x: 80, y: 80, width: 5, height: 5 },
        { x: 85, y: 82, width: 5, height: 5 },
        { x: 90, y: 90, width: 5, height: 5 }
      ];
      newObjects.forEach(obj => qt.insert(obj));
      qt.clear();
      qt.nodes.forEach(node => expect(node.objects).toHaveLength(0));
      expect(qt.objects).toHaveLength(0);
    });
  });

  describe("split", () => {
    it("should split a QuadTree into 4 sub-QuadTrees and populate the nodes propert", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      qt.split();
      const width = 50;
      const height = 50;
      expect(qt.nodes[0].bounds).toEqual({ x: 50, y: 0, width, height });
      expect(qt.nodes[1].bounds).toEqual({ x: 0, y: 0, width, height });
      expect(qt.nodes[2].bounds).toEqual({ x: 0, y: 50, width, height });
      expect(qt.nodes[3].bounds).toEqual({ x: 50, y: 50, width, height });
    });
  });

  describe("retrieve", () => {
    it("should return all objects if the QuadTree has not split", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      const newObjects = [
        { x: 0, y: 0, width: 5, height: 5 },
        { x: 25, y: 25, width: 5, height: 5 },
        { x: 50, y: 25, width: 5, height: 5 },
        { x: 75, y: 25, width: 5, height: 5 },
        { x: 25, y: 75, width: 5, height: 5 },
        { x: 45, y: 75, width: 5, height: 5 },
        { x: 80, y: 80, width: 5, height: 5 },
        { x: 90, y: 90, width: 5, height: 5 }
      ];
      newObjects.forEach(obj => qt.insert(obj));
      const possible = qt.retrieve({ x: 25, y: 25, width: 5, height: 5 });
      expect(possible).toEqual(qt.objects);
    });

    it("should return top-left objects", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      const newObjects = [
        { x: 0, y: 0, width: 5, height: 5 },
        { x: 16, y: 10, width: 5, height: 5 },
        { x: 25, y: 25, width: 5, height: 5 },
        { x: 51, y: 25, width: 5, height: 5 },
        { x: 35, y: 40, width: 5, height: 5 },
        { x: 75, y: 25, width: 5, height: 5 },
        { x: 25, y: 75, width: 5, height: 5 },
        { x: 44, y: 75, width: 5, height: 5 },
        { x: 80, y: 80, width: 5, height: 5 },
        { x: 55, y: 40, width: 5, height: 5 },
        { x: 90, y: 90, width: 5, height: 5 }
      ];
      newObjects.forEach(obj => qt.insert(obj));
      const possible = qt.retrieve({ x: 15, y: 15, width: 5, height: 5 });
      expect(possible).toEqual(qt.nodes[1].objects);
    });

    it("should return top-right objects", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      const newObjects = [
        { x: 0, y: 0, width: 5, height: 5 },
        { x: 16, y: 10, width: 5, height: 5 },
        { x: 25, y: 25, width: 5, height: 5 },
        { x: 51, y: 25, width: 5, height: 5 },
        { x: 35, y: 40, width: 5, height: 5 },
        { x: 75, y: 25, width: 5, height: 5 },
        { x: 25, y: 75, width: 5, height: 5 },
        { x: 44, y: 75, width: 5, height: 5 },
        { x: 80, y: 80, width: 5, height: 5 },
        { x: 55, y: 40, width: 5, height: 5 },
        { x: 90, y: 90, width: 5, height: 5 }
      ];
      newObjects.forEach(obj => qt.insert(obj));
      const possible = qt.retrieve({ x: 55, y: 15, width: 5, height: 5 });
      expect(possible).toEqual(qt.nodes[0].objects);
    });

    it("should return bottom-left objects", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      const newObjects = [
        { x: 0, y: 0, width: 5, height: 5 },
        { x: 16, y: 10, width: 5, height: 5 },
        { x: 25, y: 25, width: 5, height: 5 },
        { x: 51, y: 25, width: 5, height: 5 },
        { x: 35, y: 40, width: 5, height: 5 },
        { x: 75, y: 25, width: 5, height: 5 },
        { x: 25, y: 75, width: 5, height: 5 },
        { x: 44, y: 75, width: 5, height: 5 },
        { x: 80, y: 80, width: 5, height: 5 },
        { x: 55, y: 40, width: 5, height: 5 },
        { x: 90, y: 90, width: 5, height: 5 }
      ];
      newObjects.forEach(obj => qt.insert(obj));
      const possible = qt.retrieve({ x: 15, y: 55, width: 5, height: 5 });
      expect(possible).toEqual(qt.nodes[2].objects);
    });

    it("should return bottom-right objects", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      const newObjects = [
        { x: 0, y: 0, width: 5, height: 5 },
        { x: 16, y: 10, width: 5, height: 5 },
        { x: 25, y: 25, width: 5, height: 5 },
        { x: 51, y: 25, width: 5, height: 5 },
        { x: 35, y: 40, width: 5, height: 5 },
        { x: 75, y: 25, width: 5, height: 5 },
        { x: 25, y: 75, width: 5, height: 5 },
        { x: 44, y: 75, width: 5, height: 5 },
        { x: 80, y: 80, width: 5, height: 5 },
        { x: 55, y: 40, width: 5, height: 5 },
        { x: 90, y: 90, width: 5, height: 5 }
      ];
      newObjects.forEach(obj => qt.insert(obj));
      const possible = qt.retrieve({ x: 55, y: 55, width: 5, height: 5 });
      expect(possible).toEqual(qt.nodes[3].objects);
    });

    it("should also return objects that overlap quadrants", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      const newObjects = [
        { x: 0, y: 0, width: 5, height: 5 },
        { x: 16, y: 10, width: 5, height: 5 },
        { x: 25, y: 25, width: 5, height: 5 },
        { x: 50, y: 25, width: 5, height: 5 },
        { x: 35, y: 45, width: 5, height: 5 },
        { x: 75, y: 25, width: 5, height: 5 },
        { x: 25, y: 75, width: 5, height: 5 },
        { x: 44, y: 75, width: 5, height: 5 },
        { x: 80, y: 80, width: 5, height: 5 },
        { x: 55, y: 40, width: 5, height: 5 },
        { x: 90, y: 90, width: 5, height: 5 }
      ];
      newObjects.forEach(obj => qt.insert(obj));
      const possible = qt.retrieve({ x: 25, y: 25, width: 5, height: 5 });
      expect(possible).toEqual([
        { x: 0, y: 0, width: 5, height: 5 },
        { x: 16, y: 10, width: 5, height: 5 },
        { x: 25, y: 25, width: 5, height: 5 },
        { x: 50, y: 25, width: 5, height: 5 },
        { x: 35, y: 45, width: 5, height: 5 }
      ]);
    });
  });
});
