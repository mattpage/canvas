import Physics from "../Physics";
import Entity from "../Entity";
import Vector from "../Vector";

describe("Physics", () => {
  describe("Physics", () => {
    describe("Physics.constrainEntity", () => {
      describe("with wrap option", () => {
        it("should not constrain an entity that is within the bounding rectangle", () => {
          const entity = Entity.create(new Vector(0, 0), 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { x, y } = entity.location;
          Physics.constrainEntity(entity, bounds, { wrap: true });
          expect(entity.location.x).toEqual(x);
          expect(entity.location.y).toEqual(y);
        });

        it("should wrap an entity that passes beyond the left side of the bounding rectangle", () => {
          const entity = Entity.create(new Vector(-10, 0), 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { y } = entity.location;
          Physics.constrainEntity(entity, bounds, { wrap: true });
          expect(entity.location.x).toEqual(100 + entity.width / 2);
          expect(entity.location.y).toEqual(y);
        });

        it("should wrap an entity that passes beyond the top side of the bounding rectangle", () => {
          const entity = Entity.create(new Vector(0, -10), 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { x } = entity.location;
          Physics.constrainEntity(entity, bounds, { wrap: true });
          expect(entity.location.x).toEqual(x);
          expect(entity.location.y).toEqual(100 + entity.height / 2);
        });

        it("should wrap an entity that passes beyond the right side of the bounding rectangle", () => {
          const entity = Entity.create(new Vector(110, 10), 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { y } = entity.location;
          Physics.constrainEntity(entity, bounds, { wrap: true });
          expect(entity.location.x).toEqual(0 - entity.width / 2);
          expect(entity.location.y).toEqual(y);
        });

        it("should wrap an entity that passes beyond the bottom side of the bounding rectangle", () => {
          const entity = Entity.create(new Vector(10, 110), 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { x } = entity.location;
          Physics.constrainEntity(entity, bounds, { wrap: true });
          expect(entity.location.x).toEqual(x);
          expect(entity.location.y).toEqual(0 - entity.height / 2);
        });
      });

      describe("without wrap option", () => {
        it("should not constrain an entity that is within the bounding rectangle", () => {
          const entity = Entity.create(new Vector(0, 0), 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { x, y } = entity.location;
          Physics.constrainEntity(entity, bounds);
          expect(entity.location.x).toEqual(x);
          expect(entity.location.y).toEqual(y);
        });

        it("should constrain an entity to the left side of the bounding rectangle", () => {
          const entity = Entity.create(new Vector(-10, 0), 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { y } = entity.location;
          Physics.constrainEntity(entity, bounds);
          expect(entity.location.x).toEqual(0);
          expect(entity.location.y).toEqual(y);
        });

        it("should constrain an entity to the top side of the bounding rectangle", () => {
          const entity = Entity.create(new Vector(0, -10), 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { x } = entity.location;
          Physics.constrainEntity(entity, bounds);
          expect(entity.location.x).toEqual(x);
          expect(entity.location.y).toEqual(0);
        });

        it("should constrain an entity to the right side of the bounding rectangle", () => {
          const entity = Entity.create(new Vector(110, 10), 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { y } = entity.location;
          Physics.constrainEntity(entity, bounds);
          expect(entity.location.x).toEqual(100 - entity.width);
          expect(entity.location.y).toEqual(y);
        });

        it("should constrain an entity to the bottom side of the bounding rectangle", () => {
          const entity = Entity.create(new Vector(10, 110), 10, 10);
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          const { x } = entity.location;
          Physics.constrainEntity(entity, bounds);
          expect(entity.location.x).toEqual(x);
          expect(entity.location.y).toEqual(100 - entity.height);
        });
      });

      describe("with deflect option", () => {
        it("should not deflect an entity that is within the bounding rectangle", () => {
          const vx = 3;
          const vy = 2.5;
          const entity = Entity.create(
            new Vector(0, 0),
            10,
            10,
            new Vector(vx, vy)
          );
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          Physics.constrainEntity(entity, bounds, { deflect: true });
          expect(entity.velocity.x).toEqual(vx);
          expect(entity.velocity.y).toEqual(vy);
        });

        it("should deflect an entity from the left side of the bounding rectangle", () => {
          const vx = 3;
          const vy = 2.5;
          const entity = Entity.create(
            new Vector(-10, 0),
            10,
            10,
            new Vector(vx, vy)
          );
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          Physics.constrainEntity(entity, bounds, { deflect: true });
          expect(entity.velocity.x).toEqual(-vx);
          expect(entity.velocity.y).toEqual(vy);
        });

        it("should deflect an entity from the top side of the bounding rectangle", () => {
          const vx = 3;
          const vy = 2.5;
          const entity = Entity.create(
            new Vector(0, -10),
            10,
            10,
            new Vector(vx, vy)
          );
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          Physics.constrainEntity(entity, bounds, { deflect: true });
          expect(entity.velocity.x).toEqual(vx);
          expect(entity.velocity.y).toEqual(-vy);
        });

        it("should deflect an entity from the right side of the bounding rectangle", () => {
          const vx = 3;
          const vy = 2.5;
          const entity = Entity.create(
            new Vector(110, 10),
            10,
            10,
            new Vector(vx, vy)
          );
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          Physics.constrainEntity(entity, bounds, { deflect: true });
          expect(entity.velocity.x).toEqual(-vx);
          expect(entity.velocity.y).toEqual(vy);
        });

        it("should deflect an entity from the bottom side of the bounding rectangle", () => {
          const vx = 3;
          const vy = 2.5;
          const entity = Entity.create(
            new Vector(10, 110),
            10,
            10,
            new Vector(vx, vy)
          );
          const bounds = {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          };
          Physics.constrainEntity(entity, bounds, { deflect: true });
          expect(entity.velocity.x).toEqual(vx);
          expect(entity.velocity.y).toEqual(-vy);
        });
      });
    });

    describe("Physics.collision", () => {
      it("should detect a collision when entities occupy the exact same space", () => {
        const a = Entity.create(new Vector(0, 0), 100, 100);
        const b = Entity.create(new Vector(0, 0), 100, 100);
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
          entities[0].velocity = new Vector(1, 1);
          entities[1].velocity = new Vector(10, 10);
          Physics.update(60 / 1000, entities, {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          });
          expect(entities[0].location.x).toEqual(0.06);
          expect(entities[0].location.y).toEqual(0.06);
          expect(entities[1].location.x).toEqual(0.6);
          expect(entities[1].location.y).toEqual(0.6);
          Physics.update(60 / 1000, entities, {
            top: 0,
            left: 0,
            right: 100,
            bottom: 100
          });
          expect(entities[0].location.x).toEqual(0.12);
          expect(entities[0].location.y).toEqual(0.12);
          expect(entities[1].location.x).toEqual(1.2);
          expect(entities[1].location.y).toEqual(1.2);
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
    });
  });
});
