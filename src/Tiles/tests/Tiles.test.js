import Tiles from "../Tiles";
import Tile from "../Tile";

const setup = () => {};

describe("Tiles", () => {
  beforeEach(setup);

  it("should construct", () => {
    const tiles = new Tiles();
    expect(tiles).toBeInstanceOf(Tiles);
  });

  it("should set reasonable defaults", () => {
    const tiles = new Tiles();
    expect(tiles.tiles).toEqual([]);
    expect(tiles.count).toEqual(0);
  });

  it("should return the count of tiles", () => {
    const tiles = new Tiles([Tile.create(), Tile.create()]);
    expect(tiles.count).toEqual(2);
  });

  it("should be possible to get a tile by index", () => {
    const t1 = Tile.create();
    const t2 = Tile.create();
    const tiles = new Tiles([t1, t2]);
    expect(tiles.tiles[0]).toEqual(t1);
    expect(tiles.tiles[1]).toEqual(t2);
  });

  it("should render tiles", () => {
    const mockContext = () => ({
      drawImage: jest.fn()
    });
    const mockImage = () => ({
      render: jest.fn()
    });
    const image1 = mockImage();
    const image2 = mockImage();
    const tile1 = Tile.create(image1);
    const tile2 = Tile.create(image2);
    const context = mockContext();
    const tiles = new Tiles([tile1, tile2]);
    tiles.render(context);
    expect(image1.render).toHaveBeenCalled();
    expect(image2.render).toHaveBeenCalled();
  });
});
