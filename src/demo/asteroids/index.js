/* eslint no-param-reassign: ["error", { "props": false }] */
import { Game, Canvas, KEYS, Physics, integerInRange } from "../../index";
import Asteroid, { AsteroidSize } from "./Asteroid";
import Spaceship, { SpaceshipType } from "./Spaceship";
import Bullet, { BulletType } from "./Bullet";

const logger = console;

// This gets called once before render.
// Here setup the game state and create a bunch of stuff
const initializer = (context, canvas, controls, state) => {
  logger.log("initializing game");

  // offscreen canvas for double buffering
  state.offscreen = Canvas.create();
  state.offscreenContext = state.offscreen.context("2d");

  const dim = canvas.dimensions;

  // create a bunch of asteroids
  while (state.entities.length < state.maxAsteroids) {
    const x = integerInRange(0, dim.width);
    const y = integerInRange(0, dim.height);
    const options = {
      showOffset: false,
      showRect: false
    };
    state.entities.push(
      Asteroid.createRandom(x, y, AsteroidSize.Large, options)
    );
  }

  // create the player spaceship
  state.playerShip = Spaceship.create(
    SpaceshipType.Player,
    dim.width / 2,
    dim.height / 2
  );
  state.entities.push(state.playerShip);

  // hookup the player keys
  controls.keyboard.captureKey(KEYS.ARROW_LEFT, keyInfo => {
    // rotate the ship left
    const ship = state.playerShip;
    if (ship) {
      ship.torque = keyInfo.isDown ? -0.005 : 0;
    }
  });
  controls.keyboard.captureKey(KEYS.ARROW_RIGHT, keyInfo => {
    // rotate the ship right
    const ship = state.playerShip;
    if (ship) {
      ship.torque = keyInfo.isDown ? 0.005 : 0;
    }
  });
  controls.keyboard.captureKey(KEYS.ARROW_UP, keyInfo => {
    // accelerate the ship
    const ship = state.playerShip;
    if (ship) {
      ship.ax = keyInfo.isDown ? Math.cos(ship.rotation) * 0.05 : 0;
      ship.ay = keyInfo.isDown ? Math.sin(ship.rotation) * 0.05 : 0;
    }
  });
  controls.keyboard.captureKey(KEYS.SPACEBAR, keyInfo => {
    const ship = state.playerShip;
    if (ship) {
      if (keyInfo.isDown) {
        const bullet = Bullet.create(
          BulletType.Diamond,
          ship.x,
          ship.y,
          0, // vx
          0, // vy
          ship.rotation,
          1 // torque
        );
        bullet.ax = Math.cos(ship.rotation) * 0.5;
        bullet.ay = Math.sin(ship.rotation) * 0.5;
        state.entities.push(bullet);
      }
    }
  });

  logger.log("game initialized");
};

// This gets called every repeatedly (requestAnimationFrame)
// Here's where the bulk of the game happens
const renderer = (context, canvas, controls, state) => {
  const dim = canvas.dimensions;

  // erase the offscreen canvas
  state.offscreenContext.fillStyle = "white";
  state.offscreenContext.fillRect(0, 0, dim.width, dim.height);

  // update asteroid physics
  Physics.update(
    state.entities,
    {
      top: 0,
      left: 0,
      bottom: dim.height,
      right: dim.width
    },
    { wrap: true }
  );

  // process all of the entities
  state.entities = state.entities
    .map(entity => {
      const updates = [];
      let shouldRender = true;
      const isSpaceship = entity.constructor.name === "Spaceship";
      const isBullet = entity.constructor.name === "Bullet";
      const isAsteroid = entity.constructor.name === "Asteroid";

      // if there is a collision we replace an asteroid entity with 2 smaller asteroids
      // and update the velocity vectors so that the two smaller asteroids are
      // traveling apart at 30deg angles. If the collision is with a spaceship entity,
      // the spaceship is destroyed
      if (entity.collisions.length > 0) {
        // assume this entity is not going to be survive collision
        shouldRender = false;

        if (isSpaceship) {
          // the spaceship is destroyed if it collides with anything
          state.playerShip = null;
        } else if (isBullet) {
          // a bullet is destroyed if it collides with anything
        } else if (isAsteroid) {
          updates.push(...entity.collision());
        }
      } else {
        // if no collisions, keep the entity
        updates.push(entity);
      }

      if (shouldRender) {
        // render the entity
        entity.render(state.offscreenContext);
      }

      return updates;
    }) // flatten the array of arrays
    .reduce((acc, val) => acc.concat(val), []);

  // copy the offscreen canvas to the display canvas
  context.drawImage(state.offscreen.canvas, 0, 0);

  // return true to keep animating
  return true;
};

// create our Game object and use the canvas with specified id
const game = Game.create("canvas");

// our initial state that gets passed to initialize and render
const initialGameState = {
  entities: [],
  maxAsteroids: 20,
  playerShip: null
};

// start the game (call initializer and then renderer repeatedly)
game.start(renderer, initializer, initialGameState);
