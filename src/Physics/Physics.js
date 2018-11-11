import QuadTree from "./QuadTree";

class Physics {
  static constrainEntity(entity, boundsRect, options = {}) {
    const halfWidth = entity.width / 2;
    const halfHeight = entity.height / 2;
    const { deflect, wrap } = options;
    let { x, y, vx, vy } = entity;

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
        if (deflect) {
          vx = -vx;
        }
      }

      // off left edge
      if (x < boundsRect.left) {
        x = boundsRect.left;
        if (deflect) {
          vx = -vx;
        }
      }

      // off bottom edge
      if (y + entity.height > boundsRect.bottom) {
        y = boundsRect.bottom - entity.height;
        if (deflect) {
          vy = -vy;
        }
      }

      // off top edge
      if (y < boundsRect.top) {
        y = boundsRect.top;
        if (deflect) {
          vy = -vy;
        }
      }
    }

    entity.x = x;
    entity.y = y;
    entity.vx = vx;
    entity.vy = vy;
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
    return function bruteForceCollisionStrategy(entities) {
      if (!Array.isArray(entities)) {
        throw new Error("Expected entities param to be an Array");
      }
      const collisionMap = new Map();
      let i;
      let j;
      let entity;
      let otherEntity;
      let collisions;
      const len = entities.length;
      for (i = 0; i < len; ++i) {
        entity = entities[i];
        if (entity.expired) {
          // force a collision on expired entities
          collisionMap.set(entity, []);
        } else {
          for (j = 0; j < len; ++j) {
            if (i !== j) {
              otherEntity = entities[j];
              if (Physics.collision(entity.rect, otherEntity.rect)) {
                collisions = collisionMap.get(entity) || [];
                collisions.push(otherEntity);
                collisionMap.set(entity, collisions);
              }
            }
          }
        }
      }
      return collisionMap;
    };
  }

  static createSpatialPartitioningCollisionStrategy() {
    return function spatialPartitioningCollisionStrategy(entities) {
      if (!(entities instanceof QuadTree)) {
        throw new Error("Expected entities param to be instance of QuadTree");
      }
      const collisionMap = new Map();

      const { items } = entities;
      const numItems = items.length;
      let i;
      let j;
      let entity;
      let nearbyEntity;
      let collisions;
      let nearbyEntities;
      let numNearby;

      //  for every entity we retrieve and collision check only those entities that are near the entity
      for (i = 0; i < numItems; ++i) {
        entity = items[i];
        if (entity.expired) {
          // force a collision on expired entities
          collisionMap.set(entity, []);
        } else {
          nearbyEntities = entities.retrieve(entity.rect);
          numNearby = nearbyEntities.length;
          for (j = 0; j < numNearby; ++j) {
            if (i !== j) {
              nearbyEntity = nearbyEntities[j];
              if (Physics.collision(entity.rect, nearbyEntity.rect)) {
                collisions = collisionMap.get(entity) || [];
                collisions.push(nearbyEntity);
                collisionMap.set(entity, collisions);
              }
            }
          } // end for
        }
      } // end for
      return collisionMap;
    };
  }

  static move(timeStep, entities, bounds, options) {
    if (!Array.isArray(entities)) {
      throw new Error("Expected entities param to be an Array");
    }
    const len = entities.length;
    let i;
    let entity;
    let r;

    // move and constrain
    for (i = 0; i < len; ++i) {
      entity = entities[i];
      if (entity && !entity.expired) {
        if (entity.expires) {
          entity.expires -= timeStep;
          if (entity.expires <= 0) {
            // this entity has expired and should be removed from the game
            entity.expired = true;
            // eslint-disable-next-line no-continue
            continue;
          }
        }

        // update velocity
        entity.vx += entity.ax;
        entity.vy += entity.ay;

        // update position
        entity.x += entity.vx * timeStep;
        entity.y += entity.vy * timeStep;

        // if it has torque, rotate the entity
        r = timeStep * entity.torque;
        if (r !== 0) {
          entity.rotation += r;
        }
        // ensure the entity is within the world bounds
        Physics.constrainEntity(entity, bounds, options);
      }
    }
  }

  static update(
    timeStep,
    entities,
    bounds,
    options = { deflect: false, wrap: false }
  ) {
    let useSpatialPartitioning = false;
    if (Array.isArray(entities)) {
      useSpatialPartitioning = false;
    } else if (entities instanceof QuadTree) {
      useSpatialPartitioning = true;
    } else {
      throw new Error("Unknown entities object");
    }

    const items = useSpatialPartitioning ? entities.items : entities;
    // move and constrain
    Physics.move(timeStep, items, bounds, options);

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
          } else if (useSpatialPartitioning) {
            entities.insert(result);
          } else {
            entities.push(result);
          }
        });
      }

      // did the entity itself survive?
      // if not, remove it
      if (removeEntity) {
        if (useSpatialPartitioning) {
          entities.remove(entity);
        } else {
          entities.splice(entities.indexOf(entity), 1);
        }
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
