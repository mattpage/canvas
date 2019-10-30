import Tile from "../Tile";

const setup = () => {};

describe("Tile", () => {
  beforeEach(setup);

  it("should construct", () => {
    const tile = new Tile();
    expect(tile).toBeInstanceOf(Tile);
  });
});
