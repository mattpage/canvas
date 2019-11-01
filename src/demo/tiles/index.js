import {
  Canvas,
  Game,
  createAvgFpsCalculator,
  KEYS,
  Physics,
  Entity,
  Vector
} from "../../index";

import {
  loadBackgroundTiles,
  loadSpriteTiles,
  BACKGROUND_ATLAS_ROWS,
  BACKGROUND_ATLAS_COLS,
  TILE_SIZE
} from "./tiles";

import "./style.css";

const logger = console;

class Sprite extends Entity {
  constructor(tiles, index) {
    super(Vector.create(0, 0), TILE_SIZE, TILE_SIZE);
    this._index = index;
    this._tiles = tiles;
  }

  get index() {
    return this._index;
  }

  set index(n) {
    this._index = n;
  }

  render(context) {
    this._tiles.render(context, this._index, this.location.x, this.location.y);
  }
}

const handlePlayerKeys = state => {
  const { keys, sprite } = state;
  let keyInfo;

  while (keys.length > 0) {
    keyInfo = keys.pop();

    let spriteTileIndex = sprite.index;
    const lastSpriteTileIndex = spriteTileIndex;

    switch (keyInfo.keyCode) {
      case KEYS.ARROW_LEFT:
        switch (spriteTileIndex) {
          case 9:
            spriteTileIndex = 10;
            break;
          case 10:
            spriteTileIndex = 11;
            break;
          case 11:
            spriteTileIndex = 9;
            break;
          default:
            spriteTileIndex = 9;
            break;
        }
        console.log("LEFT", lastSpriteTileIndex, spriteTileIndex);
        sprite.acceleration.subtract(Vector.create(0.01, 0));
        break;
      case KEYS.ARROW_RIGHT:
        switch (spriteTileIndex) {
          case 0:
            spriteTileIndex = 1;
            break;
          case 1:
            spriteTileIndex = 2;
            break;
          case 2:
            spriteTileIndex = 0;
            break;
          default:
            spriteTileIndex = 0;
            break;
        }
        console.log("RIGHT", lastSpriteTileIndex, spriteTileIndex);
        sprite.acceleration.add(Vector.create(0.01, 0));
        break;
      case KEYS.ARROW_UP:
        // accelerate/decelerate the ship
        // ship.acceleration = keyInfo.isDown
        break;
      case KEYS.ARROW_DOWN:
        if (keyInfo.isDown) {
        }
        break;
      default:
        // ignore
        break;
    } // end switch

    if (spriteTileIndex !== lastSpriteTileIndex) {
      sprite.index = spriteTileIndex;
    }
  }
};

const initializer = (context, canvas, { keyboard }, state) => {
  logger.log("initializing game");

  loadBackgroundTiles().then(bgTiles => {
    state.layers.push(bgTiles);
    loadSpriteTiles().then(spriteTiles => {
      state.sprite = new Sprite(spriteTiles, 0);
    });
  });

  // offscreen canvas for double buffering
  state.offscreen = Canvas.create();
  state.offscreenContext = state.offscreen.context();

  state.calcAvgFps = createAvgFpsCalculator();
  state.fpsEl = window.document.querySelector("#fps");
  state.tilesEl = window.document.querySelector("#tiles");

  // hookup the player keys
  keyboard.captureKeys(
    [KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT, KEYS.ARROW_UP, KEYS.ARROW_DOWN],
    keyInfo => {
      state.keys.push(keyInfo);
    }
  );

  logger.log("game initialized");
};

const updater = (timeStep, context, canvas, ...rest) => {
  const state = rest[1];

  // handle the player keyboard input
  handlePlayerKeys(state);

  const dim = canvas.dimensions;

  const sprite = state.sprite;
  if (sprite) {
    Physics.update(
      timeStep,
      [sprite],
      {
        top: 0,
        left: 0,
        bottom: Math.min(dim.height, BACKGROUND_ATLAS_ROWS * TILE_SIZE),
        right: Math.min(dim.width, BACKGROUND_ATLAS_COLS * TILE_SIZE)
      },
      {
        handleCollisions: false,
        vLimit: { min: Vector.create(-0.01, 0), max: Vector.create(0.01, 0) }
      }
    );
  }
};

const renderer = (context, canvas, interfaces, state) => {
  const dim = canvas.dimensions;
  state.offscreenContext.imageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;

  // erase the offscreen canvas
  state.offscreenContext.fillStyle = "white";
  state.offscreenContext.fillRect(0, 0, dim.width, dim.height);

  let tileCount = 0;

  state.layers.forEach(layer => {
    // render the tiles
    layer.render(state.offscreenContext);
    tileCount += layer.count;
  });

  const sprite = state.sprite;
  if (sprite) {
    sprite.render(state.offscreenContext);
  }

  // display the total tiles
  state.tilesEl.textContent = `${tileCount}`;

  // copy the offscreen canvas to the display canvas
  context.drawImage(state.offscreen.canvas, 0, 0);

  // display the frame rate
  state.fpsEl.textContent = `${state.calcAvgFps()}`;

  // return true to keep animating
  return true;
};

const game = Game.create("canvas");
game.start(renderer, updater, initializer, {
  layers: [],
  keys: [],
  sprite: null
});
