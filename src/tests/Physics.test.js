import Physics, { Entity } from "../Physics";

describe("Physics", () => {
  describe("Physics", () => {
    it("should construct", () => {
      const entity = new Physics();
      expect(entity).toBeInstanceOf(Physics);
    });

    describe("Physics.create", () => {
      it("should create", () => {
        const entity = Physics.create();
        expect(entity).toBeInstanceOf(Physics);
      });
    });
  });

  describe("Entity", () => {
    it("should construct", () => {
      const entity = new Entity();
      expect(entity).toBeInstanceOf(Entity);
    });
    it("should set the default position to (0,0)", () => {
      const entity = new Entity();
      expect(entity.x).toEqual(0);
      expect(entity.y).toEqual(0);
    });
    it("should set the default width to 0", () => {
      const entity = new Entity();
      expect(entity.width).toEqual(0);
    });
    it("should set the default height to 0", () => {
      const entity = new Entity();
      expect(entity.height).toEqual(0);
    });
    describe("Entity.create", () => {
      it("should create", () => {
        const entity = Entity.create();
        expect(entity).toBeInstanceOf(Entity);
      });
    });
  });
});
