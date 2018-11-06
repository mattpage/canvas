import Entity from "../Entity";

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
    expect(entity.ax).toEqual(0);
    expect(entity.ay).toEqual(0);
  });

  it("should be possible to set position", () => {
    const entity = new Entity();
    entity.x = 42;
    entity.y = 24;
    expect(entity.x).toEqual(42);
    expect(entity.y).toEqual(24);
  });

  it("should set rotation angle to >-360 && <360", () => {
    const entity = new Entity();
    entity.rotation = 1;
    expect(entity.rotation).toEqual(1);
    entity.rotation = -1;
    expect(entity.rotation).toEqual(-1);
    entity.rotation = 360;
    expect(entity.rotation).toEqual(0);
    entity.rotation = -360;
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

  it("should be possible to get/set torque", () => {
    const entity = new Entity();
    expect(entity.torque).toEqual(0);
    entity.torque = 1;
    expect(entity.torque).toEqual(1);
  });

  it("should be possible to get/set type", () => {
    const entity = new Entity();
    expect(entity.type).toBeUndefined();
    entity.type = "test";
    expect(entity.type).toEqual("test");
    entity.type = 42;
    expect(entity.type).toEqual(42);
  });

  it("should be possible to handle collisions", () => {
    const entity = new Entity();
    entity.type = "A";
    entity.collidesWith = { B: 1 };
    const otherEntity = Entity.create();
    otherEntity.type = "B";
    const result = entity.collision([otherEntity]);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(0);
  });

  describe("Entity.create", () => {
    it("should create", () => {
      const entity = Entity.create();
      expect(entity).toBeInstanceOf(Entity);
    });
  });
});
