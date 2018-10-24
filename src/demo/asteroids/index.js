import { Game, Canvas, KEYS, Physics, createAvgFpsRenderer } from "../../index";
import Asteroid, { AsteroidType } from "./Asteroid";
import Spaceship, { SpaceshipType } from "./Spaceship";
import Bullet, { BulletType } from "./Bullet";
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

// TODO - this should probably be a class of some sort
const createGameOverMenu = (state, dim) => {
  state.gameOverMenu = window.document.getElementById("game-over");
  state.gameOverMenu.addEventListener("click", event => {
    if (event && event.target.id === "new-game") {
      event.preventDefault();
      event.stopPropagation();
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
  state.gameOverMenu.show = function showGameOver() {
    // remove hidden class and the element will show itself
    this.classList.remove("hidden");
  }.bind(state.gameOverMenu);
  state.gameOverMenu.hide = function hideGameOver() {
    // add hidden class and the element will hide itself
    this.classList.add("hidden");
  }.bind(state.gameOverMenu);
};

// TODO - this can probably leverage the same class as GameOverMenu
const createLevelBanner = state => {
  state.levelBanner = window.document.getElementById("level");
  state.levelBannerTitle = window.document.getElementById("level-title");
  state.levelBanner.show = function showGameOver(text) {
    state.levelBannerTitle.textContent = text;
    // remove hidden class and the element will show itself
    this.classList.remove("hidden");
    setTimeout(() => {
      // after two seconds, hide the element
      this.classList.add("hidden");
    }, 2000);
  }.bind(state.levelBanner);
};

// Here setup the game state and create a bunch of stuff
const initializer = (context, canvas, interfaces, state) => {
  logger.log("initializing game");

  // offscreen canvas for double buffering
  state.offscreen = Canvas.create();
  state.offscreenContext = state.offscreen.context("2d");

  // fps renderer
  state.displayAvgFps = createAvgFpsRenderer();

  // load the audio channels
  state.audioChannels = {
    fire1: interfaces.audio.load("/demo/asteroids/assets/fire.wav", null, 0.25),
    fire2: interfaces.audio.load("/demo/asteroids/assets/fire.wav", null, 0.25),
    fire3: interfaces.audio.load("/demo/asteroids/assets/fire.wav", null, 0.25)
  };

  const dim = canvas.dimensions;

  createGameOverMenu(state, dim);
  createLevelBanner(state);
  state.entities.push(
    ...Asteroid.createMultipleRandom(state.maxAsteroids, dim),
    Spaceship.create(
      SpaceshipType.Player,
      dim.width / 2,
      dim.height / 2,
      createCollidesWithMap(true)
    )
  );

  // hookup the player keys
  interfaces.keyboard.captureKeys(
    [KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT, KEYS.ARROW_UP, KEYS.SPACEBAR],
    keyInfo => {
      state.keys.push(keyInfo);
    }
  );

  logger.log("game initialized");
};

// This gets called every repeatedly (requestAnimationFrame)
// Here's where the bulk of the game happens
const renderer = (context, canvas, interfaces, state) => {
  const dim = canvas.dimensions;

  // erase the offscreen canvas
  state.offscreenContext.fillStyle = "white";
  state.offscreenContext.fillRect(0, 0, dim.width, dim.height);

  // show FPS
  state.displayAvgFps(state.offscreenContext, dim.width - 110, 24);

  // handle player keys
  const ship = state.entities.find(
    entity => entity.type === SpaceshipType.Player
  );
  if (ship) {
    let keyInfo;
    while (state.keys.length > 0) {
      keyInfo = state.keys.pop();
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
            bullet.expires = 1000; // bullets disappear after 1sec
            state.entities.push(bullet);
            interfaces.audio.playAny([
              state.audioChannels.fire1,
              state.audioChannels.fire2,
              state.audioChannels.fire3
            ]);
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
    state.levelBanner.show(`LEVEL ${state.level}`);
    state.entities.push(
      ...Asteroid.createMultipleRandom(state.maxAsteroids, dim)
    );
  }

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
  gameOver: false,
  keys: [],
  level: 1,
  maxAsteroids: 20
};

// start the game (call initializer and then renderer repeatedly)
game.start(renderer, initializer, initialGameState);
