import TileMap from "../TileMap";

const setup = () => {};

describe("TileMap", () => {
  beforeEach(setup);

  it("should construct", () => {
    const tileMap = new TileMap();
    expect(tileMap).toBeInstanceOf(TileMap);
  });

  it("should set reasonable defaults", () => {
    const tileMap = new TileMap();
    expect(tileMap.rows).toEqual(0);
    expect(tileMap.columns).toEqual(0);
    expect(tileMap.get(0, 0)).toEqual(null);
  });

  it("should return a tile index at a column and row", () => {
    const tileMap = new TileMap([[1, 2, 3, 4], [5, 6, 7, 8]], 64);
    expect(tileMap.get(1, 1)).toEqual(6);
  });

  it("should return the number of columns", () => {
    const tileMap = new TileMap([[1, 2, 3, 4], [5, 6, 7, 8]], 64);
    expect(tileMap.columns).toEqual(4);
  });

  it("should return the number of rows", () => {
    const tileMap = new TileMap([[1, 2, 3, 4], [5, 6, 7, 8]], 64);
    expect(tileMap.rows).toEqual(2);
  });

  describe("TileMap.create", () => {
    it("should create", () => {
      const tileMap = TileMap.create();
      expect(tileMap).toBeInstanceOf(TileMap);
    });
  });
});
