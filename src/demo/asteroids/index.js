import {
  Game,
  Canvas,
  KEYS,
  Physics,
  createAvgFpsRenderer,
  drawText,
  integerInRange
} from "../../index";
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

const createAsteroids = (state, dimensions) => {
  while (state.entities.length < state.maxAsteroids) {
    const x = integerInRange(0, dimensions.width);
    const y = integerInRange(0, dimensions.height);
    const options = {
      showOffset: false,
      showRect: false
    };
    state.entities.push(
      Asteroid.createRandom(x, y, AsteroidType.Large, options)
    );
  }
};

const createPlayerShip = (state, dim) => {
  state.playerShip = Spaceship.create(
    SpaceshipType.Player,
    dim.width / 2,
    dim.height / 2
  );
  state.playerShip.collidesWith = createCollidesWithMap(true);
  state.entities.push(state.playerShip);
};

const createNewGame = (state, dim) => {
  state.entities.length = 0;
  state.keys.length = 0;
  state.level = 1;
  state.maxAsteroids = 20;
  state.messages.length = 0;
  state.gameOver.hide();
  createAsteroids(state, dim);
  createPlayerShip(state, dim);
};

// Here setup the game state and create a bunch of stuff
const initializer = (context, canvas, controls, state) => {
  logger.log("initializing game");

  // offscreen canvas for double buffering
  state.offscreen = Canvas.create();
  state.offscreenContext = state.offscreen.context("2d");

  // fps renderer
  state.displayAvgFps = createAvgFpsRenderer();

  const dim = canvas.dimensions;

  // setup the game over menu
  state.gameOver = window.document.getElementById("game-over");
  state.gameOver.addEventListener("click", event => {
    if (event && event.target.id === "new-game") {
      event.preventDefault();
      event.stopPropagation();
      createNewGame(state, dim);
    }
  });
  state.gameOver.show = function showGameOver() {
    // remove hidden class and the element will show itself
    this.classList.remove("hidden");
  }.bind(state.gameOver);
  state.gameOver.hide = function hideGameOver() {
    // add hidden class and the element will hide itself
    this.classList.add("hidden");
  }.bind(state.gameOver);

  createAsteroids(state, dim);
  createPlayerShip(state, dim);

  // hookup the player keys
  controls.keyboard.captureKeys(
    [KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT, KEYS.ARROW_UP, KEYS.SPACEBAR],
    keyInfo => {
      state.keys.push(keyInfo);
    }
  );

  logger.log("game initialized");
};

// This gets called every repeatedly (requestAnimationFrame)
// Here's where the bulk of the game happens
const renderer = (context, canvas, controls, state) => {
  const dim = canvas.dimensions;

  // erase the offscreen canvas
  state.offscreenContext.fillStyle = "white";
  state.offscreenContext.fillRect(0, 0, dim.width, dim.height);

  // show FPS
  state.displayAvgFps(state.offscreenContext, dim.width - 110, 24);

  // handle player keys
  const ship = state.playerShip;
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

  let other = 0;
  let players = 0;

  // render all of the entities and calc the number of players, asteroids, etc
  state.entities.forEach(entity => {
    if (entity.type === SpaceshipType.Player) {
      players += 1;
    } else {
      other += 1;
    }

    entity.render(state.offscreenContext);
  });

  // if there are no more players
  if (players < 1) {
    // the game is over
    if (state.playerShip) {
      state.playerShip = null;
      state.gameOver.show();
    }
  }

  // if the player is the only entity left
  if (players > 0 && other < 1) {
    // move to the next level
    state.level += 1;
    state.maxAsteroids += 5;
    const msg = `LEVEL ${state.level}`;
    state.messages.push(msg);
    createAsteroids(state, dim);
    setTimeout(() => {
      const index = state.messages.indexOf(msg);
      if (index > -1) {
        state.messages.splice(index, 1);
      }
    }, 2000);
  }

  // draw any messages to the screen
  state.messages.forEach((message, index) => {
    drawText(
      state.offscreenContext,
      message,
      dim.width / 2,
      dim.height / 2 + index * 24,
      { textAlign: "center" }
    );
  });

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
  keys: [],
  level: 1,
  maxAsteroids: 20,
  messages: [],
  playerShip: null
};

// start the game (call initializer and then renderer repeatedly)
game.start(renderer, initializer, initialGameState);
