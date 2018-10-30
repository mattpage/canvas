import QuadTree from "../QuadTree";

describe("QuadTree", () => {
  describe("constructor", () => {
    it("should construct", () => {
      expect(
        new QuadTree({ x: 0, y: 0, width: 100, height: 100 })
      ).toBeInstanceOf(QuadTree);
    });
  });
});
