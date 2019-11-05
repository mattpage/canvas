import Tile from "../Tile";

const setup = () => {};

describe("Tile", () => {
  beforeEach(setup);

  it("should construct", () => {
    const tile = new Tile();
    expect(tile).toBeInstanceOf(Tile);
  });

  it("should set reasonable defaults", () => {
    const tile = new Tile();
    expect(tile.x).toEqual(0);
    expect(tile.y).toEqual(0);
    expect(tile.srcX).toEqual(0);
    expect(tile.srcY).toEqual(0);
    expect(tile.width).toEqual(32);
    expect(tile.height).toEqual(32);
  });

  it("should render", () => {
    const mockContext = () => ({
      drawImage: jest.fn()
    });
    const mockImage = () => ({
      render: jest.fn()
    });
    const image = mockImage();
    const tile = Tile.create(image);
    const context = mockContext();
    tile.render(context);
    expect(image.render).toHaveBeenCalled();
  });

  describe("Tile.create", () => {
    it("should create", () => {
      const tile = Tile.create();
      expect(tile).toBeInstanceOf(Tile);
    });
  });
});
