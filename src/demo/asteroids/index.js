import {
  Game,
  Canvas,
  KEYS,
  Physics,
  createAvgFpsCalculator,
  createAvgTimeCalculator,
  integerInRange
} from "../../index";
import Asteroid, { AsteroidType } from "./Asteroid";
import Spaceship, { SpaceshipType } from "./Spaceship";
import Bullet, { BulletType } from "./Bullet";
import { DebrisType } from "./Debris";
import GameOver from "./GameOver";
import Banner from "./Banner";
import GameStats from "./GameStats";
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

  // add all of the debris type
  Object.values(DebrisType).forEach(t => {
    collidesWith[t] = true;
  });

  return collidesWith;
};

const createCollisionHandler = (audioFx, callback) => () => {
  if (integerInRange(0, 1)) {
    audioFx.explode1.play();
  } else {
    audioFx.explode2.play();
  }
  if (callback) {
    callback();
  }
};

const createPlayerSpaceship = (dim, audioFx) => {
  const collidesWith = createCollidesWithMap(true);
  const spaceship = Spaceship.create(
    SpaceshipType.Player,
    dim.width / 2,
    dim.height / 2,
    collidesWith,
    createCollisionHandler(audioFx)
  );
  // spaceship is indestructible for 2 seconds
  spaceship.shieldsUp(2000);
  return spaceship;
};

const createAsteroids = (dim, maxAsteroids, audioFx) => {
  const asteroids = [];
  for (let i = 0; i < maxAsteroids; i++) {
    const x = integerInRange(0, dim.width);
    const y = integerInRange(0, dim.height);
    const options = {
      showOffset: false,
      showRect: false
    };
    const asteroid = Asteroid.createRandom(x, y, AsteroidType.Large, options);
    asteroid.onCollision = createCollisionHandler(audioFx);
    asteroids.push(asteroid);
  }
  return asteroids;
};

const createGameState = (level = 1) => ({
  entities: [],
  gameOver: false,
  keys: [],
  level,
  lives: 3,
  maxAsteroids: 10 + level * 10,
  score: 0
});

const findShip = entities =>
  entities.find(entity => entity.type === SpaceshipType.Player);

const handlePlayerKeys = state => {
  const { keys, audioFx } = state;
  const newEntities = [];
  const ship = findShip(state.entities);
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
            bullet.onCollision = createCollisionHandler(
              audioFx,
              () => {
                state.score += 10;
              } // points per bullet hit
            );
            bullet.expires = 1000; // bullets disappear after 1sec
            newEntities.push(bullet);
            audioFx.fire.play();
          }
          break;
        default:
          // ignore
          break;
      } // end switch
    } // end while
  }
  state.entities.push(...newEntities);
};

// Setup the game state and create a bunch of stuff
const initializer = (context, canvas, { audio, keyboard }, state) => {
  logger.log("initializing game");

  // offscreen canvas for double buffering
  state.offscreen = Canvas.create();
  state.offscreenContext = state.offscreen.context();

  state.calcAvgFps = createAvgFpsCalculator();
  state.calcAvgTime = createAvgTimeCalculator();

  // load the audio - 4 channels per file
  /* prettier-ignore */
  state.audioFx = {
    fire: audio.load("/demo/asteroids/assets/fire.wav", null, 4, 0.25),
    explode1: audio.load("/demo/asteroids/assets/explosion01.wav", null, 4, 0.25),
    explode2: audio.load("/demo/asteroids/assets/explosion02.wav", null, 4, 0.25)
  };

  const dim = canvas.dimensions;

  state.gameOverMenu = new GameOver(() => {
    // create new game
    Object.assign(state, createGameState());
    state.entities.push(
      ...createAsteroids(dim, state.maxAsteroids, state.audioFx),
      createPlayerSpaceship(dim, state.audioFx)
    );
    state.gameOverMenu.hide();
  });

  state.banner = new Banner();
  state.gameStats = new GameStats();

  // add asteroids and spaceship
  state.entities.push(
    ...createAsteroids(dim, state.maxAsteroids, state.audioFx),
    createPlayerSpaceship(dim, state.audioFx)
  );

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
  const start = window.performance.now();
  const state = rest[1];
  const dim = canvas.dimensions;

  // erase the offscreen canvas
  state.offscreenContext.fillStyle = "white";
  state.offscreenContext.fillRect(0, 0, dim.width, dim.height);

  // handle the player keyboard input
  handlePlayerKeys(state);

  // update asteroid physics
  state.entities = Physics.update(
    state.entities,
    {
      top: 0,
      left: 0,
      bottom: dim.height,
      right: dim.width
    },
    { useSpatialPartitioning: false, wrap: true }
  );

  const meta = {
    debris: 0,
    enemies: 0,
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
      case SpaceshipType.EnemySaucer:
        meta.enemies += 1;
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
        if (entity.type in DebrisType) {
          meta.debris += 1;
        } else {
          logger.warn("unknown entity type", entity.type);
        }
        break;
    }

    entity.render(state.offscreenContext);
  });

  // if there are no more players
  // the game is over or the player has lost a life
  // and we need to create a new ship
  if (meta.players < 1) {
    if (!state.gameOver) {
      if (state.lives < 1) {
        // the game is over
        state.gameOver = true;
        state.gameOverMenu.show();
      } else {
        // player has lives remaining
        // create another player ship
        Object.assign(state, createGameState(state.level), {
          entities: state.entities,
          lives: state.lives - 1,
          score: state.score
        });
        state.entities.push(createPlayerSpaceship(dim, state.audioFx));
        meta.players += 1;
      }
    }
  }

  // if the player is still alive
  // and all of the asteroids are destroyed
  // move to the next level
  if (meta.players > 0 && meta.asteroids < 1) {
    const playerShip = state.entities.find(
      entity => entity.type === SpaceshipType.Player
    );
    playerShip.shieldsUp(2000);
    Object.assign(state, createGameState(state.level + 1), {
      lives: state.lives,
      score: state.score
    });
    state.banner.show(`LEVEL ${state.level}`, 2000);
    state.entities.push(
      playerShip,
      ...createAsteroids(dim, state.maxAsteroids, state.audioFx)
    );
  }

  // copy the offscreen canvas to the display canvas
  context.drawImage(
    state.offscreen.canvas,
    0,
    0,
    dim.width,
    dim.height,
    0,
    0,
    dim.width,
    dim.height
  );

  state.gameStats.update({
    ...meta,
    fps: state.calcAvgFps(),
    level: state.level,
    lives: state.lives,
    score: state.score,
    render: state.calcAvgTime(start, window.performance.now()) // .toFixed(2)
  });

  // return true to keep animating
  return true;
};

// create and start the game (call initializer with inital game state and then renderer repeatedly)
Game.create("canvas").start(renderer, initializer, createGameState());
