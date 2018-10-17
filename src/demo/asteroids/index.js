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

// Here setup the game state and create a bunch of stuff
const initializer = (context, canvas, controls, state) => {
  logger.log("initializing game");

  // offscreen canvas for double buffering
  state.offscreen = Canvas.create();
  state.offscreenContext = state.offscreen.context("2d");

  // fps renderer
  state.displayAvgFps = createAvgFpsRenderer();

  const dim = canvas.dimensions;

  state.gameOver = window.document.getElementById("game-over");
  state.gameOver.addEventListener("click", event => {
    if (event && event.target.id === "restart") {
      event.preventDefault();
      event.stopPropagation();
      // createAsteroids(state, dim);
    }
  });

  createAsteroids(state, dim);
  createPlayerShip(state, dim);

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
        bullet.collidesWith = createCollidesWithMap(true);
        bullet.expires = 1000; // bullets disappear after 1sec
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

  // show FPS
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
  let other = 0;
  let players = 0;

  state.entities.forEach(entity => {
    if (entity.type === SpaceshipType.Player) {
      players += 1;
    } else {
      other += 1;
    }

    entity.render(state.offscreenContext);
  });

  if (players < 1) {
    // game over
    if (state.playerShip) {
      state.playerShip = null;
      // remove hidden class and the element will show itself
      state.gameOver.classList.remove("hidden");
    }
  }

  if (other < 1) {
    // next level
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
  level: 1,
  maxAsteroids: 20,
  messages: [],
  playerShip: null
};

// start the game (call initializer and then renderer repeatedly)
game.start(renderer, initializer, initialGameState);
