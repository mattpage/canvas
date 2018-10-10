import PolygonEntity from "../PolygonEntity";

describe("PolygonEntity", () => {
  it("should construct", () => {
    const entity = new PolygonEntity();
    expect(entity).toBeInstanceOf(PolygonEntity);
  });
  describe("render", () => {
    // TODO it should have some tests
  });
});
