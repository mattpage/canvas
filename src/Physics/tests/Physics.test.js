import Physics from "../Physics";
import Entity from "../Entity";
import QuadTree from "../QuadTree";

describe("Physics", () => {
  describe("Physics", () => {
    describe("Physics.constrainEntity", () => {
      describe("with wrap option", () => {
        it("should not constrain an entity that is within the bounding rectangle", () => {
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
        it("should not constrain an entity that is within the bounding rectangle", () => {
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

      describe("with deflect option", () => {
        it("should not deflect an entity that is within the bounding rectangle", () => {
          const vx = 3;
          const vy = 2.5;
          const entity = Entity.create(0, 0, 10, 10, vx, vy);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          Physics.constrainEntity(entity, bounds, { deflect: true });
          expect(entity.vx).toEqual(vx);
          expect(entity.vy).toEqual(vy);
        });

        it("should deflect an entity from the left side of the bounding rectangle", () => {
          const vx = 3;
          const vy = 2.5;
          const entity = Entity.create(-10, 0, 10, 10, vx, vy);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          Physics.constrainEntity(entity, bounds, { deflect: true });
          expect(entity.vx).toEqual(-vx);
          expect(entity.vy).toEqual(vy);
        });

        it("should deflect an entity from the top side of the bounding rectangle", () => {
          const vx = 3;
          const vy = 2.5;
          const entity = Entity.create(0, -10, 10, 10, vx, vy);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          Physics.constrainEntity(entity, bounds, { deflect: true });
          expect(entity.vx).toEqual(vx);
          expect(entity.vy).toEqual(-vy);
        });

        it("should deflect an entity from the right side of the bounding rectangle", () => {
          const vx = 3;
          const vy = 2.5;
          const entity = Entity.create(110, 10, 10, 10, vx, vy);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          Physics.constrainEntity(entity, bounds, { deflect: true });
          expect(entity.vx).toEqual(-vx);
          expect(entity.vy).toEqual(vy);
        });

        it("should deflect an entity from the bottom side of the bounding rectangle", () => {
          const vx = 3;
          const vy = 2.5;
          const entity = Entity.create(10, 110, 10, 10, vx, vy);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          Physics.constrainEntity(entity, bounds, { deflect: true });
          expect(entity.vx).toEqual(vx);
          expect(entity.vy).toEqual(-vy);
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
      describe("with Entities array - brute force collision strategy", () => {
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
          Physics.update(60 / 1000, entities, {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          });
          expect(entities[0].rotation).toEqual(0.06);
          expect(entities[1].rotation).toEqual(0);
        });

        it("should remove an expired entity", () => {
          const entities = [Entity.create(), Entity.create()];
          const entity = Entity.create();
          entity.expires = 0.01;

          entities.push(entity);
          const len = entities.length;

          Physics.update(60 / 1000, entities, {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          });

          expect(entities.length).toEqual(len - 1);
        });
      });

      describe("with Entities QuadTree - spatial partitioning strategy", () => {
        it("should update the position of passed in entities", () => {
          const qt = new QuadTree({ width: 100, height: 100 });
          qt.insert(Entity.create(0, 0, 10, 10, 1, 1));
          qt.insert(Entity.create(0, 0, 10, 10, 10, 10));
          Physics.update(60 / 1000, qt, {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          });
          expect(qt.items[0].x).toEqual(0.06);
          expect(qt.items[0].y).toEqual(0.06);
          expect(qt.items[1].x).toEqual(0.6);
          expect(qt.items[1].y).toEqual(0.6);

          Physics.update(60 / 1000, qt, {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          });
          expect(qt.items[0].x).toEqual(0.12);
          expect(qt.items[0].y).toEqual(0.12);
          expect(qt.items[1].x).toEqual(1.2);
          expect(qt.items[1].y).toEqual(1.2);
        });

        it("should update the rotation of passed in entities", () => {
          const qt = new QuadTree({ width: 100, height: 100 });
          qt.insert(Entity.create(0, 0, 10, 10, 1, 1, 0.06));
          qt.insert(Entity.create(0, 0, 10, 10, 10, 10));
          Physics.update(60 / 1000, qt, {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          });
          expect(qt.items[0].rotation).toEqual(0.06);
          expect(qt.items[1].rotation).toEqual(0);
        });

        it("should remove an expired entity", () => {
          const qt = new QuadTree({ width: 100, height: 100 });
          qt.insert(Entity.create(0, 0, 10, 10, 1, 1, 0.06));
          qt.insert(Entity.create(0, 0, 10, 10, 10, 10));
          qt.insert(Entity.create(0, 0, 10, 10, 10, 10));
          qt.items[2].expires = 0.01;

          const len = qt.size;

          Physics.update(60 / 1000, qt, {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          });

          expect(qt.size).toEqual(len - 1);
        });
      });
    });
  });
});
