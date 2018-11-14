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

  it("should delegate rendering to the inner polygon", () => {
    const entity = new PolygonEntity();
    entity.polygon.render = jest.fn();
    entity.render({});
    expect(entity.polygon.render).toHaveBeenCalled();
  });
});
