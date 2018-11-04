// import QuadTree from "./QuadTree";

class Physics {
  static constrainEntity(entity, boundsRect, options = {}) {
    const halfWidth = entity.width / 2;
    const halfHeight = entity.height / 2;
    const { wrap } = options;
    let { x, y } = entity;

    if (wrap) {
      // off right edge
      if (x - halfWidth > boundsRect.right) {
        x = boundsRect.left - halfWidth;
      }

      // off left edge
      if (x + halfWidth < boundsRect.left) {
        x = boundsRect.right + halfWidth;
      }

      // off bottom edge
      if (y - halfHeight > boundsRect.bottom) {
        y = boundsRect.top - halfHeight;
      }

      // off top edge
      if (y + halfHeight < boundsRect.top) {
        y = boundsRect.bottom + halfHeight;
      }
    } else {
      // off right edge
      if (x + entity.width > boundsRect.right) {
        x = boundsRect.right - entity.width;
      }

      // off left edge
      if (x < boundsRect.left) {
        x = boundsRect.left;
      }

      // off bottom edge
      if (y + entity.height > boundsRect.bottom) {
        y = boundsRect.bottom - entity.height;
      }

      // off top edge
      if (y < boundsRect.top) {
        y = boundsRect.top;
      }
    }

    entity.x = x;
    entity.y = y;
  }

  /* prettier-ignore */
  static collision(a, b) {
    return !(
      a.left > b.right || // A is right of B
      a.right < b.left || // A is left of B
      a.bottom < b.top || // A is above B
      a.top > b.bottom    // A is below B
    );   
  }

  // collision detection - O(n^2) complexity
  static createBruteForceCollisionStrategy() {
    return entities => {
      const collisionMap = new Map();
      entities.forEach(entity => {
        if (entity.expired) {
          // force a collision on expired entities
          collisionMap.set(entity, []);
        } else {
          entities.forEach(otherEntity => {
            if (entity !== otherEntity) {
              if (Physics.collision(entity.rect, otherEntity.rect)) {
                const collisions = collisionMap.get(entity) || [];
                collisions.push(otherEntity);
                collisionMap.set(entity, collisions);
              }
            }
          });
        }
      });
      return collisionMap;
    };
  }

  static createSpatialPartitioningCollisionStrategy() {
    return entities => {
      const collisionMap = new Map();
      //  for every entity we retrieve and collision check only those entities that are near the entity
      entities.forEach(entity => {
        if (entity.expired) {
          // force a collision on expired entities
          collisionMap.set(entity, []);
        } else {
          const nearbyEntities = entities.retrieve(entity.rect);
          nearbyEntities.forEach(nearEntity => {
            if (entity !== nearEntity) {
              if (Physics.collision(entity.rect, nearEntity.rect)) {
                const collisions = collisionMap.get(entity) || [];
                collisions.push(nearEntity);
                collisionMap.set(entity, collisions);
              }
            }
          });
        }
      });
      return collisionMap;
    };
  }

  static update(entities, bounds, options = { wrap: false }) {
    const now = Date.now();

    let useSpatialPartitioning = false;
    if (Array.isArray(entities)) {
      useSpatialPartitioning = false;
    } else if (entities.constructor.name === "QuadTree") {
      useSpatialPartitioning = true;
    } else {
      throw new Error("Unknown entities object");
    }

    // move and constrain
    entities.forEach(entity => {
      const diff = now - entity.elapsed;
      entity.elapsed = now;

      if (entity.expires) {
        entity.expires -= diff;
        if (entity.expires <= 0) {
          // this entity has expired and should be removed from the game
          entity.expired = true;
          return;
        }
      }

      // update velocity
      entity.vx += entity.ax;
      entity.vy += entity.ay;

      // update position
      entity.x += entity.vx;
      entity.y += entity.vy;

      // if it has torque, rotate the entity
      const r = diff * entity.torque;
      if (r !== 0) {
        entity.rotation += r;
      }
      // ensure the entity is within the world bounds
      Physics.constrainEntity(entity, bounds, options);
    });

    const collisionStrategy = useSpatialPartitioning
      ? Physics.createSpatialPartitioningCollisionStrategy(bounds)
      : Physics.createBruteForceCollisionStrategy(bounds);

    // collision detection
    const collisionMap = collisionStrategy(entities);

    // resolve collisions
    collisionMap.forEach((collisions, entity) => {
      // assume the entity does not survive the collision
      let removeEntity = true;

      if (!entity.expired) {
        // entity.collision must return an empty array or an array of resulting entities
        // if the entity survives the collision, then it should be included in the array
        const collisionResults = entity.collision(collisions);

        // insert every collision result that is not the entity itself
        collisionResults.forEach(result => {
          if (result === entity) {
            removeEntity = false;
          } else {
            entities.insert(result);
          }
        });
      }

      // did the entity itself survive?
      // if not, remove it
      if (removeEntity) {
        entities.remove(entity);
      }
    });
  }

  static splitVelocityVector(vx, vy, deflectionDegrees = 30) {
    // directional recoil
    const kx = vx < 0 ? -1 : 1;
    const ky = vy < 0 ? -1 : 1;

    // velocity vector
    const vector = Math.sqrt(vx * vx + vy * vy);

    // angle of velocity vector
    const theta = Math.atan(vy / vx);

    // deflect +- deflectionDegrees
    const alpha1 = (deflectionDegrees * Math.PI) / 180;
    const alpha2 = -alpha1;

    return [
      {
        vx: vector * Math.cos(alpha1 + theta) * kx,
        vy: vector * Math.sin(alpha1 + theta) * ky
      },
      {
        vx: vector * Math.cos(alpha2 + theta) * kx,
        vy: vector * Math.sin(alpha2 + theta) * ky
      }
    ];
  }
}

export default Physics;
