import PolygonEntity from "../PolygonEntity";

describe("PolygonEntity", () => {
  describe("PolygonEntity.create", () => {
    it("should create", () => {
      const entity = PolygonEntity.create();
      expect(entity).toBeInstanceOf(PolygonEntity);
    });
  });

  it("should construct", () => {
    const entity = new PolygonEntity();
    expect(entity).toBeInstanceOf(PolygonEntity);
  });
  describe("render", () => {
    // TODO it should have some tests
  });
});
