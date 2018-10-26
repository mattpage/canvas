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
import Dialog from "./Dialog";
import "./style.css";

const logger = console;

// this map indicates what the entity can collide with
const createCollidesWithMap = friendly => {
  const collidesWith = {
    // [SpaceshipType.Enemy]: friendly,
    [BulletType.Enemy]: friendly,
    [BulletType.Player]: !friendly,
    [SpaceshipType.Player]: !friendly
  };

  // add all of the asteroids
  Object.values(AsteroidType).forEach(t => {
    collidesWith[t] = true;
  });

  return collidesWith;
};

const createCollisionHandler = audioFx => () => {
  if (integerInRange(0, 1)) {
    audioFx.explode1.play();
  } else {
    audioFx.explode2.play();
  }
};

// Setup the game state and create a bunch of stuff
const initializer = (context, canvas, { audio, keyboard }, state) => {
  logger.log("initializing game");

  // offscreen canvas for double buffering
  state.offscreen = Canvas.create();
  state.offscreenContext = state.offscreen.context("2d");

  // fps renderer
  state.displayAvgFps = createAvgFpsRenderer();

  // load the audio - 4 channels per file
  /* prettier-ignore */
  state.audioFx = {
    fire: audio.load("/demo/asteroids/assets/fire.wav", null, 4, 0.25),
    explode1: audio.load("/demo/asteroids/assets/explosion01.wav", null, 4, 0.25),
    explode2: audio.load("/demo/asteroids/assets/explosion02.wav", null, 4, 0.25)
  };

  const dim = canvas.dimensions;

  state.gameOverMenu = new Dialog("game-over", event => {
    if (event.target.id === "new-game") {
      // create new game
      state.keys.length = 0;
      state.level = 1;
      state.maxAsteroids = 20;
      state.gameOver = false;
      state.gameOverMenu.hide();
      state.entities = Asteroid.createMultipleRandom(state.maxAsteroids, dim);
      state.entities.push(
        Spaceship.create(
          SpaceshipType.Player,
          dim.width / 2,
          dim.height / 2,
          createCollidesWithMap(true)
        )
      );
    }
  });

  state.levelBanner = new Dialog("level");

  const handleCollision = createCollisionHandler(state.audioFx);

  const asteroids = Asteroid.createMultipleRandom(
    state.maxAsteroids,
    dim,
    handleCollision
  );

  const spaceship = Spaceship.create(
    SpaceshipType.Player,
    dim.width / 2,
    dim.height / 2,
    createCollidesWithMap(true),
    handleCollision
  );

  // add asteroids and spaceship
  state.entities.push(...asteroids, spaceship);

  // hookup the player keys
  keyboard.captureKeys(
    [KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT, KEYS.ARROW_UP, KEYS.SPACEBAR],
    keyInfo => {
      state.keys.push(keyInfo);
    }
  );

  logger.log("game initialized");
};

// This gets called repeatedly (requestAnimationFrame)
// Here's where the bulk of the game happens
const renderer = (context, canvas, ...rest) => {
  const state = rest[1];
  const dim = canvas.dimensions;

  const { audioFx, displayAvgFps, keys, offscreenContext } = state;

  // erase the offscreen canvas
  offscreenContext.fillStyle = "white";
  offscreenContext.fillRect(0, 0, dim.width, dim.height);

  // show FPS
  displayAvgFps(offscreenContext, dim.width - 110, 24);

  // handle player keys
  const ship = state.entities.find(
    entity => entity.type === SpaceshipType.Player
  );
  if (ship) {
    let keyInfo;
    while (keys.length > 0) {
      keyInfo = keys.pop();
      switch (keyInfo.keyCode) {
        case KEYS.ARROW_LEFT:
          // rotate the ship left
          ship.torque = keyInfo.isDown ? -0.005 : 0;
          break;
        case KEYS.ARROW_RIGHT:
          // rotate the ship right
          ship.torque = keyInfo.isDown ? 0.005 : 0;
          break;
        case KEYS.ARROW_UP:
          // accelerate the ship
          ship.ax = keyInfo.isDown ? Math.cos(ship.rotation) * 0.05 : 0;
          ship.ay = keyInfo.isDown ? Math.sin(ship.rotation) * 0.05 : 0;
          break;
        case KEYS.SPACEBAR:
          // fire bullets
          if (keyInfo.isDown) {
            const bullet = Bullet.create(
              BulletType.Diamond,
              ship.x + Math.cos(ship.rotation) * 20,
              ship.y + Math.sin(ship.rotation) * 20,
              0, // vx
              0, // vy
              ship.rotation,
              1 // torque
            );
            bullet.ax = Math.cos(ship.rotation) * 0.5;
            bullet.ay = Math.sin(ship.rotation) * 0.5;
            bullet.collidesWith = createCollidesWithMap(true);
            bullet.onCollision = createCollisionHandler(audioFx);
            bullet.expires = 1000; // bullets disappear after 1sec
            state.entities.push(bullet);
            audioFx.fire.play();
          }
          break;
        default:
          // ignore
          break;
      } // end switch
    } // end while
  }

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

  const meta = {
    players: 0,
    bullets: 0,
    asteroids: 0
  };

  // render all of the entities and calc the number of players, asteroids, etc
  state.entities.forEach(entity => {
    switch (entity.type) {
      case SpaceshipType.Player:
        meta.players += 1;
        break;
      case BulletType.Enemy:
      case BulletType.Player:
        meta.bullets += 1;
        break;
      case AsteroidType.Large:
      case AsteroidType.Medium:
      case AsteroidType.Small:
      case AsteroidType.Tiny:
        meta.asteroids += 1;
        break;
      default:
        logger.warn("unknown entity type", entity.type);
        break;
    }
    entity.render(state.offscreenContext);
  });

  // if there are no more players
  if (meta.players < 1) {
    // the game is over
    if (!state.gameOver) {
      state.gameOver = true;
      state.gameOverMenu.show();
    }
  }

  // if all of the asteroids are destroyedif all of the asteroids are destroyedif all of the asteroids are destroyedif all of the asteroids are destroyed
  if (meta.players > 0 && meta.asteroids < 1) {
    // move to the next level
    state.level += 1;
    state.maxAsteroids += 5;
    state.levelBanner.setText("level-title", `LEVEL ${state.level}`);
    state.levelBanner.show(2000);
    state.entities.push(
      ...Asteroid.createMultipleRandom(state.maxAsteroids, dim)
    );
  }

  // copy the offscreen canvas to the display canvas
  context.drawImage(state.offscreen.canvas, 0, 0);

  // return true to keep animating
  return true;
};

// create and start the game (call initializer with inital game state and then renderer repeatedly)
Game.create("canvas").start(renderer, initializer, {
  entities: [],
  gameOver: false,
  keys: [],
  level: 1,
  maxAsteroids: 1
});
