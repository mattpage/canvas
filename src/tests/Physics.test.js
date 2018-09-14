import Physics, { Entity } from "../Physics";

describe("Physics", () => {
  describe("Physics", () => {
    it("should construct", () => {
      const physics = new Physics();
      expect(physics).toBeInstanceOf(Physics);
    });

    describe("constrainEntity", () => {
      it("should constrain an entity to a bounding rectangle", () => {});
      it("should wrap an entity to a bounding rectangle", () => {});
    });

    describe("Physics.create", () => {
      it("should create", () => {
        const physics = Physics.create();
        expect(physics).toBeInstanceOf(Physics);
      });
    });
  });

  describe("Entity", () => {
    it("should construct", () => {
      const entity = new Entity();
      expect(entity).toBeInstanceOf(Entity);
    });

    it("should set reasonable defaults", () => {
      const entity = new Entity();
      expect(entity.x).toEqual(0);
      expect(entity.y).toEqual(0);
      expect(entity.width).toEqual(0);
      expect(entity.height).toEqual(0);
      expect(entity.rotation).toEqual(0);
      expect(entity.torque).toEqual(0);
      expect(entity.vx).toEqual(0);
      expect(entity.vy).toEqual(0);
    });

    it("should be possible to set position", () => {
      const entity = new Entity();
      entity.x = 42;
      entity.y = 24;
      expect(entity.x).toEqual(42);
      expect(entity.y).toEqual(24);
    });

    it("should be possible to get/set the collision flag", () => {
      const entity = new Entity();
      entity.collision = true;
      expect(entity.collision).toBe(true);
      entity.collision = false;
      expect(entity.collision).toBe(false);
    });

    it("should set rotation angle to >=0 && <=360", () => {
      const entity = new Entity();
      entity.rotation = 1;
      expect(entity.rotation).toEqual(1);
      entity.rotation = -1;
      expect(entity.rotation).toEqual(360);
      entity.rotation = 361;
      expect(entity.rotation).toEqual(0);
    });

    it("should return a rectangle", () => {
      const entity = new Entity(1, 2, 100, 200);
      const rc = entity.rect;
      expect(rc.left).toEqual(1);
      expect(rc.top).toEqual(2);
      expect(rc.right).toEqual(101);
      expect(rc.bottom).toEqual(202);
    });

    it("should have timestamp", () => {
      const entity = new Entity();
      expect(entity.elapsed).toBeGreaterThan(0);
      expect(entity.elapsed).toBeLessThan(Number.MAX_VALUE);
      const ms = Date.now();
      entity.elapsed = ms;
      expect(entity.elapsed).toEqual(ms);
    });

    it("should be possible to get/set velocity", () => {
      const entity = new Entity();
      entity.vx = 42.4;
      expect(entity.vx).toEqual(42.4);
      entity.vy = 22.1;
      expect(entity.vy).toEqual(22.1);
    });

    it("should be possible to get/set acceleration", () => {
      const entity = new Entity();
      entity.ax = 2.4;
      expect(entity.ax).toEqual(2.4);
      entity.ay = 4.2;
      expect(entity.ay).toEqual(4.2);
    });

    describe("Entity.create", () => {
      it("should create", () => {
        const entity = Entity.create();
        expect(entity).toBeInstanceOf(Entity);
      });
    });
  });
});
