import QuadTree from "../QuadTree";

describe("QuadTree", () => {
  it("should construct", () => {
    expect(
      new QuadTree({ x: 0, y: 0, width: 100, height: 100 })
    ).toBeInstanceOf(QuadTree);
  });

  it("should return an empty collection of nodes and an empty collection of items", () => {
    const qt = new QuadTree();
    expect(qt.nodes).toEqual([]);
    expect(qt.keys).toEqual([]);
  });

  it("should return an empty node collection while inserted item count does not exceed maxItemsPerNode", () => {
    const qt = new QuadTree();
    const newItems = [
      { x: 0, y: 0, width: 5, height: 5 },
      { x: 20, y: 20, width: 5, height: 5 },
      { x: 30, y: 30, width: 5, height: 5 },
      { x: 40, y: 40, width: 5, height: 5 },
      { x: 50, y: 50, width: 5, height: 5 },
      { x: 60, y: 60, width: 5, height: 5 },
      { x: 70, y: 70, width: 5, height: 5 },
      { x: 80, y: 80, width: 5, height: 5 },
      { x: 90, y: 90, width: 5, height: 5 }
    ].map((item, index) => {
      item.key = index.toString();
      return item;
    });
    newItems.forEach(obj => qt.insert(obj));
    expect(qt.nodes).toEqual([]);
    expect(qt.keys).toHaveLength(newItems.length);
  });

  it("should split, redistribute items, and contain a collection of 4 nodes when the inserted item count exceeds maxObjects", () => {
    const qt = new QuadTree();
    const newItems = [
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
    ].map((item, index) => {
      item.key = index.toString();
      return item;
    });
    newItems.forEach(obj => qt.insert(obj));
    expect(qt.keys).toEqual([]);
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
    expect(qt.nodes[0].keys).toEqual(["6", "10"]);

    // upper left quadrant
    expect(qt.nodes[1]).toBeInstanceOf(QuadTree);
    expect(qt.nodes[1].bounds).toEqual({
      x: 0,
      y: 0,
      width: 50,
      height: 50
    });
    expect(qt.nodes[1].keys).toEqual(["0", "1", "2", "3", "4", "5"]);

    // lower left quadrant
    expect(qt.nodes[2]).toBeInstanceOf(QuadTree);
    expect(qt.nodes[2].bounds).toEqual({
      x: 0,
      y: 50,
      width: 50,
      height: 50
    });
    expect(qt.nodes[2].keys).toEqual(["7", "8", "9"]);

    // lower right quadrant
    expect(qt.nodes[3]).toBeInstanceOf(QuadTree);
    expect(qt.nodes[3].bounds).toEqual({
      x: 50,
      y: 50,
      width: 50,
      height: 50
    });
    expect(qt.nodes[3].keys).toEqual(["11", "12", "13"]);
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

  describe("maxItemsPerNode", () => {
    it("should return the default maxItemsPerNode of the quadtree", () => {
      const qt = new QuadTree();
      expect(qt.maxItemsPerNode).toEqual(10);
    });
    it("should return the explicit maxItemsPerNode of the quadtree", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds, 0, 20);
      expect(qt.maxItemsPerNode).toEqual(20);
    });
  });

  describe("clear", () => {
    it("should clear all items and all nodes", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      const newItems = [
        { x: 0, y: 0, width: 5, height: 5 },
        { x: 25, y: 25, width: 5, height: 5 },
        { x: 50, y: 25, width: 5, height: 5 },
        { x: 75, y: 25, width: 5, height: 5 },
        { x: 25, y: 75, width: 5, height: 5 },
        { x: 45, y: 75, width: 5, height: 5 },
        { x: 80, y: 80, width: 5, height: 5 },
        { x: 90, y: 90, width: 5, height: 5 }
      ].map((item, index) => {
        item.key = index.toString();
        return item;
      });
      newItems.forEach(obj => qt.insert(obj));
      qt.clear();
      expect(qt.keys).toHaveLength(0);
      expect(qt.size).toEqual(0);
    });

    it("should clear all items and split nodes", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      const newItems = [
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
      ].map((item, index) => {
        item.key = index.toString();
        return item;
      });
      newItems.forEach(obj => qt.insert(obj));
      qt.clear();
      expect(qt.size).toEqual(0);
      qt.nodes.forEach(node => expect(node.keys).toHaveLength(0));
    });
  });

  describe("split", () => {
    it("should split a QuadTree into 4 sub-QuadTrees and populate the nodes property", () => {
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
    it("should return all items if the QuadTree has not split", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      const items = [
        { x: 0, y: 0, width: 5, height: 5 },
        { x: 25, y: 25, width: 5, height: 5 },
        { x: 50, y: 25, width: 5, height: 5 },
        { x: 75, y: 25, width: 5, height: 5 },
        { x: 25, y: 75, width: 5, height: 5 },
        { x: 45, y: 75, width: 5, height: 5 },
        { x: 80, y: 80, width: 5, height: 5 },
        { x: 90, y: 90, width: 5, height: 5 }
      ].map((item, index) => {
        item.key = index.toString();
        return item;
      });
      items.forEach(obj => qt.insert(obj));
      const possible = qt.retrieve({ x: 25, y: 25, width: 5, height: 5 });
      expect(possible).toEqual(items);
    });

    it("should return top-left objects", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      const newItems = [
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
      ].map((item, index) => {
        item.key = index.toString();
        return item;
      });
      newItems.forEach(obj => qt.insert(obj));
      const possible = qt.retrieve({ x: 15, y: 15, width: 5, height: 5 });
      expect(possible).toEqual([
        newItems[0],
        newItems[1],
        newItems[2],
        newItems[4]
      ]);
    });

    it("should return top-right objects", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      const newItems = [
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
      ].map((item, index) => {
        item.key = index.toString();
        return item;
      });
      newItems.forEach(obj => qt.insert(obj));
      const possible = qt.retrieve({ x: 55, y: 15, width: 5, height: 5 });
      expect(possible).toEqual([newItems[3], newItems[5], newItems[9]]);
    });

    it("should return bottom-left objects", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      const newItems = [
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
      ].map((item, index) => {
        item.key = index.toString();
        return item;
      });
      newItems.forEach(obj => qt.insert(obj));
      const possible = qt.retrieve({ x: 15, y: 55, width: 5, height: 5 });
      expect(possible).toEqual([newItems[6], newItems[7]]);
    });

    it("should return bottom-right objects", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      const newItems = [
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
      ].map((item, index) => {
        item.key = index.toString();
        return item;
      });
      newItems.forEach(obj => qt.insert(obj));
      const possible = qt.retrieve({ x: 55, y: 55, width: 5, height: 5 });
      expect(possible).toEqual([newItems[8], newItems[10]]);
    });

    it("should also return objects that overlap quadrants", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      const newItems = [
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
      ].map((item, index) => {
        item.key = index.toString();
        return item;
      });
      newItems.forEach(obj => qt.insert(obj));
      const possible = qt.retrieve({ x: 25, y: 25, width: 5, height: 5 });
      expect(possible).toEqual([
        newItems[0],
        newItems[1],
        newItems[2],
        newItems[3],
        newItems[4]
      ]);
    });
  });

  describe("remove", () => {
    it("should remove items from the quadtree", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const qt = new QuadTree(bounds);
      const newItems = [
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
      ].map((item, index) => {
        item.key = index.toString();
        return item;
      });
      newItems.forEach(obj => qt.insert(obj));
      const nodeIndex = qt.findNode(newItems[0]);
      expect(nodeIndex).toEqual(1);
      expect(qt.nodes[1].keys).toHaveLength(3);
      expect(qt.nodes[1].keys.includes(newItems[0].key)).toBe(true);
      qt.remove(newItems[0]);
      expect(qt.nodes[1].keys).toHaveLength(2);
      expect(qt.nodes[1].keys.includes(newItems[0].key)).toBe(false);
    });
  });

  describe("items", () => {
    it("should have some tests", () => {});
  });

  describe("forEach", () => {
    it("should have some tests", () => {});
  });
});
