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
    let { x, y, vx, vy } = entity;
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

    entity.x = x;
    entity.y = y;
    entity.vx = vx;
    entity.vy = vy;
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
    const gravity = options.gravity || 0;

    // move and constrain
    for (i = 0; i < len; ++i) {
      entity = entities[i];

      if (entity && !entity.expired) {
        // some entities expire after a perido of time
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
        entity.y += entity.vy * timeStep + gravity;

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
