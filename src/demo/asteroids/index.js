import {
  Game,
  Canvas,
  KEYS,
  Physics,
  createAvgFpsRenderer,
  integerInRange
} from "../../index";
import Asteroid, { AsteroidType } from "./Asteroid";
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
  state.displayAvgFps = createAvgFpsRenderer();

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
      Asteroid.createRandom(x, y, AsteroidType.Large, options)
    );
  }

  // create the player spaceship
  state.playerShip = Spaceship.create(
    SpaceshipType.Player,
    dim.width / 2,
    dim.height / 2
  );

  const defaultCollidesWith = {
    // [SpaceshipType.Enemy]: 1,
    [BulletType.Enemy]: 1,
    [BulletType.Player]: 0,
    [SpaceshipType.Player]: 0
  };
  Object.values(AsteroidType).forEach(t => {
    defaultCollidesWith[t] = 1;
  });

  state.playerShip.collidesWith = defaultCollidesWith;
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
        bullet.collidesWith = defaultCollidesWith;
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

  state.displayAvgFps(state.offscreenContext, dim.width - 110, 24);

  // update asteroid physics
  state.entities = Physics.update(
    state.entities,
    {
      top: 0,
      left: 0,
      bottom: dim.height,
      right: dim.width
    },
    { wrap: true }
  );

  // render all of the entities
  state.entities.forEach(entity => entity.render(state.offscreenContext));

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
