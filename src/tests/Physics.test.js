import Physics, { Entity } from "../Physics";

describe("Physics", () => {
  describe("Physics", () => {
    describe("Physics.constrainEntity", () => {
      describe("with wrap option", () => {
        it("should not constrain an entity that is with the bounding rectangle", () => {
          const entity = Entity.create(0, 0, 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { x, y } = entity;
          Physics.constrainEntity(entity, bounds, { wrap: true });
          expect(entity.x).toEqual(x);
          expect(entity.y).toEqual(y);
        });

        it("should wrap an entity that passes beyond the left side of the bounding rectangle", () => {
          const entity = Entity.create(-10, 0, 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { y } = entity;
          Physics.constrainEntity(entity, bounds, { wrap: true });
          expect(entity.x).toEqual(100 + entity.width / 2);
          expect(entity.y).toEqual(y);
        });

        it("should wrap an entity that passes beyond the top side of the bounding rectangle", () => {
          const entity = Entity.create(0, -10, 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { x } = entity;
          Physics.constrainEntity(entity, bounds, { wrap: true });
          expect(entity.x).toEqual(x);
          expect(entity.y).toEqual(100 + entity.height / 2);
        });

        it("should wrap an entity that passes beyond the right side of the bounding rectangle", () => {
          const entity = Entity.create(110, 10, 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { y } = entity;
          Physics.constrainEntity(entity, bounds, { wrap: true });
          expect(entity.x).toEqual(0 - entity.width / 2);
          expect(entity.y).toEqual(y);
        });

        it("should wrap an entity that passes beyond the bottom side of the bounding rectangle", () => {
          const entity = Entity.create(10, 110, 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { x } = entity;
          Physics.constrainEntity(entity, bounds, { wrap: true });
          expect(entity.x).toEqual(x);
          expect(entity.y).toEqual(0 - entity.height / 2);
        });
      });

      describe("without wrap option", () => {
        it("should not constrain an entity that is with the bounding rectangle", () => {
          const entity = Entity.create(0, 0, 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { x, y } = entity;
          Physics.constrainEntity(entity, bounds);
          expect(entity.x).toEqual(x);
          expect(entity.y).toEqual(y);
        });

        it("should constrain an entity to the left side of the bounding rectangle", () => {
          const entity = Entity.create(-10, 0, 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { y } = entity;
          Physics.constrainEntity(entity, bounds);
          expect(entity.x).toEqual(0);
          expect(entity.y).toEqual(y);
        });

        it("should constrain an entity to the top side of the bounding rectangle", () => {
          const entity = Entity.create(0, -10, 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { x } = entity;
          Physics.constrainEntity(entity, bounds);
          expect(entity.x).toEqual(x);
          expect(entity.y).toEqual(0);
        });

        it("should constrain an entity to the right side of the bounding rectangle", () => {
          const entity = Entity.create(110, 10, 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { y } = entity;
          Physics.constrainEntity(entity, bounds);
          expect(entity.x).toEqual(100 - entity.width);
          expect(entity.y).toEqual(y);
        });

        it("should constrain an entity to the bottom side of the bounding rectangle", () => {
          const entity = Entity.create(10, 110, 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { x } = entity;
          Physics.constrainEntity(entity, bounds);
          expect(entity.x).toEqual(x);
          expect(entity.y).toEqual(100 - entity.height);
        });
      });
    });

    describe("Physics.collision", () => {
      it("should detect a collision when entities occupy the exact same space", () => {
        const a = Entity.create(0, 0, 100, 100);
        const b = Entity.create(0, 0, 100, 100);
        expect(Physics.collision(a, b)).toBe(true);
      });
    });

    describe("Physics.update", () => {
      it("should update the position of passed in entities", () => {
        const entities = [Entity.create(), Entity.create()];
        // give them some velocity
        entities[0].vx = 1;
        entities[0].vy = 1;
        entities[1].vx = 10;
        entities[1].vy = 10;
        Physics.update(entities, { top: 0, left: 0, right: 100, bottom: 100 });
        expect(entities[0].x).toEqual(1);
        expect(entities[0].y).toEqual(1);
        expect(entities[1].x).toEqual(10);
        expect(entities[1].y).toEqual(10);
        Physics.update(entities, { top: 0, left: 0, right: 100, bottom: 100 });
        expect(entities[0].x).toEqual(2);
        expect(entities[0].y).toEqual(2);
        expect(entities[1].x).toEqual(20);
        expect(entities[1].y).toEqual(20);
      });

      it("should update the rotation of passed in entities", () => {
        const entities = [Entity.create(), Entity.create()];
        entities[0].torque = 1;
        jest.useFakeTimers();
        Physics.update(entities, {
          top: 0,
          left: 0,
          right: 100,
          bottom: 100
        });
        expect(entities[0].rotation).toBeGreaterThan(1);
        expect(entities[1].rotation).toEqual(0);
        jest.runAllTimers();
      });

      it("should constrain the passed in entities position to world bounds", () => {});

      it("should detect collisions", () => {});
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

    it("should have elapsed timestamp", () => {
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

    it("should be possible to get/set collisions", () => {
      const entity = new Entity();
      const indexArray = [0, 1];
      entity.collisions = indexArray;
      expect(entity.collisions).toEqual(indexArray);
    });

    it("should be possible to get/set torque", () => {
      const entity = new Entity();
      expect(entity.torque).toEqual(0);
      entity.torque = 1;
      expect(entity.torque).toEqual(1);
    });

    describe("Entity.create", () => {
      it("should create", () => {
        const entity = Entity.create();
        expect(entity).toBeInstanceOf(Entity);
      });
    });
  });
});
