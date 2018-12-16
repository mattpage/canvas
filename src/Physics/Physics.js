import Vector from "./Vector";

class Physics {
  static constrainEntity(
    entity,
    boundsRect,
    options = {
      constrain: true,
      deflect: false,
      wrap: false
    }
  ) {
    const halfWidth = entity.width / 2;
    const halfHeight = entity.height / 2;
    const { constrain, deflect, wrap } = options;
    const { location, velocity } = entity;
    let { x, y } = location;
    let vx = velocity.x;
    let vy = velocity.y;

    let outOfBounds = false;

    const hasConstraints = deflect || wrap || constrain;

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
        if (hasConstraints) {
          x = boundsRect.right - entity.width;
          if (deflect) {
            vx = -vx;
          }
        } else {
          outOfBounds = true;
        }
      }

      // off left edge
      if (x < boundsRect.left) {
        if (hasConstraints) {
          x = boundsRect.left;
          if (deflect) {
            vx = -vx;
          }
        } else {
          outOfBounds = true;
        }
      }

      // off bottom edge
      if (y + entity.height > boundsRect.bottom) {
        if (hasConstraints) {
          y = boundsRect.bottom - entity.height;
          if (deflect) {
            vy = -vy;
          }
        } else {
          outOfBounds = true;
        }
      }

      // off top edge
      if (y < boundsRect.top) {
        if (hasConstraints) {
          y = boundsRect.top;
          if (deflect) {
            vy = -vy;
          }
        } else {
          outOfBounds = true;
        }
      }
    }

    entity.location.x = x;
    entity.location.y = y;
    entity.velocity.x = vx;
    entity.velocity.y = vy;
    if (outOfBounds) {
      entity.expired = true;
    }
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

  static move(timeStep, entities, bounds, options) {
    const len = entities.length;
    let i;
    let entity;
    let r;
    const gravity =
      "gravity" in options ? Vector.create(0, options.gravity) : null;
    const vLimit = "vLimit" in options ? options.vLimit : null;

    // move and constrain
    for (i = 0; i < len; ++i) {
      entity = entities[i];

      if (entity && !entity.expired) {
        // some entities expire after a period of time
        if (entity.expires) {
          entity.expires -= timeStep;
          if (entity.expires <= 0) {
            // this entity has expired and should be removed from the game
            entity.expired = true;
            // eslint-disable-next-line no-continue
            continue;
          }
        }

        // apply forces
        if (gravity) {
          entity.applyForce(gravity);
        }

        // update velocity
        entity.velocity.add(entity.acceleration);

        if (vLimit) {
          entity.velocity.limit(vLimit);
        }

        // update position
        entity.location.add(
          entity.velocity.x * timeStep,
          entity.velocity.y * timeStep
        );

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
    options = { constrain: true, deflect: false, gravity: 0, wrap: false }
  ) {
    // move and constrain
    Physics.move(timeStep, entities, bounds, options);

    const collisionStrategy = Physics.createBruteForceCollisionStrategy(bounds);

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
            entities.push(result);
          }
        });
      }

      // did the entity itself survive?
      // if not, remove it
      if (removeEntity) {
        entities.splice(entities.indexOf(entity), 1);
      }
    });
  }
}

export default Physics;
