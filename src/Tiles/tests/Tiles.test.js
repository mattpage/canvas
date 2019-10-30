import Tiles from "../Tiles";

const setup = () => {};

describe("Tiles", () => {
  beforeEach(setup);

  it("should construct", () => {
    const tiles = new Tiles();
    expect(tiles).toBeInstanceOf(Tiles);
  });
});
