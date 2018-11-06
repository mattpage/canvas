import Physics from "../Physics";
import Entity from "../Entity";

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

    describe("Physics.splitVelocityVector", () => {
      it("should have some tests", () => {
        // TODO - add tests
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
        Physics.update(60 / 1000, entities, {
          top: 0,
          left: 0,
          right: 100,
          bottom: 100
        });
        expect(entities[0].x).toEqual(0.06);
        expect(entities[0].y).toEqual(0.06);
        expect(entities[1].x).toEqual(0.6);
        expect(entities[1].y).toEqual(0.6);
        Physics.update(60 / 1000, entities, {
          top: 0,
          left: 0,
          right: 100,
          bottom: 100
        });
        expect(entities[0].x).toEqual(0.12);
        expect(entities[0].y).toEqual(0.12);
        expect(entities[1].x).toEqual(1.2);
        expect(entities[1].y).toEqual(1.2);
      });

      it("should update the rotation of passed in entities", () => {
        const entities = [Entity.create(), Entity.create()];
        entities[0].torque = 1;
        jest.useFakeTimers();
        Physics.update(60 / 1000, entities, {
          top: 0,
          left: 0,
          right: 100,
          bottom: 100
        });
        expect(entities[0].rotation).toEqual(0.06);
        expect(entities[1].rotation).toEqual(0);
        jest.runAllTimers();
      });
    });
  });
});
