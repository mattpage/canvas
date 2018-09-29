import { Game, Canvas, Physics, integerInRange } from "../../index";
import Asteroid, { AsteroidSize } from "./Asteroid";
import Spaceship, { SpaceshipType } from "./Spaceship";

const calcSplitVelocityVectors = asteroid => {
  const { vx, vy } = asteroid;
  // directional recoil
  const kx = vx < 0 ? -1 : 1;
  const ky = vy < 0 ? -1 : 1;

  // velocity vector
  const vector = Math.sqrt(vx * vx + vy * vy);

  // angle of velocity vector
  const theta = Math.atan(vy / vx);

  // new debris travels +- 30 degrees
  const alpha1 = (30 * Math.PI) / 180;
  const alpha2 = -alpha1;

  // new vector angles
  const vx1 = vector * Math.cos(alpha1 + theta) * kx;
  const vy1 = vector * Math.sin(alpha1 + theta) * ky;
  const vx2 = vector * Math.cos(alpha2 + theta) * kx;
  const vy2 = vector * Math.sin(alpha2 + theta) * ky;
  return {
    vx1,
    vy1,
    vx2,
    vy2
  };
};

const splitAsteroid = (asteroid, newSize, offset) => {
  const a1 = Asteroid.createRandom(asteroid.x, asteroid.y, newSize);
  const a2 = Asteroid.createRandom(
    asteroid.x + offset,
    asteroid.y + offset,
    newSize
  );

  const { vx1, vy1, vx2, vy2 } = calcSplitVelocityVectors(asteroid);
  a1.vx = vx1;
  a1.vy = vy1;
  a2.vx = vx2;
  a2.vy = vy2;

  return [a1, a2];
};

const game = Game.create("canvas");
const offscreen = Canvas.create();
const offscreenContext = offscreen.context("2d");
const state = {
  entities: [],
  playerShip: null,
  initialized: false,
  maxAsteroids: 20
};

// start the animation loop
game.start((context, canvas) => {
  const dim = canvas.dimensions;
  const halfWidth = dim.width / 2;
  const halfHeight = dim.height / 2;

  if (!state.initialized) {
    console.log("initializing game");

    // create a bunch of asteroids
    while (state.entities.length < state.maxAsteroids) {
      const x = integerInRange(-halfWidth, halfWidth);
      const y = integerInRange(-halfHeight, halfHeight);
      const options = {
        showOffset: false,
        showRect: false
      };
      state.entities.push(
        Asteroid.createRandom(x, y, AsteroidSize.Large, options)
      );
    }

    // create the player spaceship
    state.playerShip = Spaceship.create(SpaceshipType.Player, 0, 0);
    state.entities.push(state.playerShip);

    console.log("game initialized");
    state.initialized = true;
  }

  // erase the offscreen canvas
  offscreenContext.fillStyle = "white";
  offscreenContext.fillRect(0, 0, dim.width, dim.height);

  offscreenContext.save();

  // set cartesian coordinates
  offscreenContext.translate(halfWidth, halfHeight);

  // update asteroid physics
  Physics.update(
    state.entities,
    {
      top: -halfHeight,
      left: -halfWidth,
      bottom: halfHeight,
      right: halfWidth
    },
    { wrap: true }
  );

  // update all of the entities
  state.entities = state.entities
    .map(entity => {
      const updates = [];
      let shouldRender = true;

      const isSpaceship = entity === state.playerShip;

      // if there is a collision we replace an asteroid entity with 2 smaller asteroids
      // and update the velocity vectors so that the two smaller asteroids are
      // traveling apart at 30deg angles. If the collision is with a spaceship entity,
      // the spaceship is destroyed
      if (entity.collisions.length > 0) {
        // this entity is being replaced or removed, so don't render it
        shouldRender = false;

        if (!isSpaceship) {
          switch (entity.size) {
            case AsteroidSize.Tiny:
              // when a tiny asteroid collides, it is destroyed. don't replace it or render it
              break;

            case AsteroidSize.Small:
              // when a small asteroid collides, it is replaced with two tiny asteroids
              updates.push(...splitAsteroid(entity, AsteroidSize.Tiny, 10));
              break;

            case AsteroidSize.Medium:
              // when a medium asteroid collides, it is replaced with two small asteroids
              updates.push(...splitAsteroid(entity, AsteroidSize.Small, 20));
              break;

            case AsteroidSize.Large:
              // when a large asteroid collides, it is replaced with two medium asteroids
              updates.push(...splitAsteroid(entity, AsteroidSize.Medium, 40));
              break;

            default:
              console.warn("unknown asteroid size", entity.size);
              break;
          } // end switch
        }
      } else {
        // if no collisions, keep the entity
        updates.push(entity);
      }

      if (shouldRender) {
        // render the entity
        entity.render(offscreenContext);
      }

      return updates;
    }) // flatten the array of arrays
    .reduce((acc, val) => acc.concat(val), []);

  // unset cartesian coords
  offscreenContext.restore();

  // copy the offscreen canvas to the display canvas
  context.drawImage(offscreen.canvas, 0, 0);

  // return true to keep animating
  return true;
});
