import {
  PolygonEntity,
  numberInRange,
  integerInRange,
  Vector
} from "../../index";

export const DebrisType = Object.freeze({
  Diamond: "Diamond",
  FlyingVee: "FlyingVee",
  Wedgie: "Wedgie"
});

// various bits of debris in cartesian points
/* prettier-ignore */
export const DEBRIS = [
  {
    type: DebrisType.Wedgie,
    points: [
      0, 5,
      -5, 0,
      0, 0,
    ],
  }, 
  {
    type: DebrisType.FlyingVee,
    points: [
      0, 2.5,
      -2.5, 0,
      0, -2.5,
      0, 0,
      2.5, 2.5,
    ],
  }, 
  {
    type: DebrisType.Diamond,
    points: [
      5.2, 0.1,
      1, 4,
      -4.9, 0.5,
      0.1, -5,
    ],
  },
  {
    type: DebrisType.NailClipping,
    points: [
      .3125, 0,
      0, .3125,
      -.3125, 0,
      0, -.3125,
    ],
  }
]

class Debris extends PolygonEntity {
  static create(t = null, loc = null, vel = null, onCollision = null) {
    let type = t;
    if (!type) {
      const keys = Object.keys(DebrisType);
      type = keys[integerInRange(0, keys.length - 1)];
    }

    const location = loc || Vector.create();
    const velocity =
      vel ||
      Vector.create(numberInRange(0.001, 0.05), numberInRange(0.001, 0.05));

    const debrisTypes = DEBRIS.filter(s => s.type === type);
    const deflection = integerInRange(1, 360);
    const rotation = numberInRange(1, 360);
    const torque = numberInRange(0.00001, 0.0005);
    const debris = new Debris(
      debrisTypes[0].points,
      location,
      velocity.split(deflection).shift(),
      rotation,
      torque
    );
    debris.type = type;
    debris.onCollision = onCollision;
    return debris;
  }

  collision(entities) {
    const collisions = entities.reduce((acc, entity) => {
      if (!(entity.type in DebrisType)) {
        acc.push(entity);
      }
      return acc;
    }, []);

    if (collisions.length > 0) {
      if (this.onCollision) {
        this.onCollision(collisions);
      }
      return [];
    }
    return [this];
  }
}

export default Debris;
