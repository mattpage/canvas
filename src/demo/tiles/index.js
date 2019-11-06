import { Canvas, Game, createAvgFpsCalculator, KEYS } from "../../index";

import {
  loadBackgroundTiles,
  loadSpriteTiles,
  BACKGROUND_ATLAS_ROWS,
  BACKGROUND_ATLAS_COLS,
  TILE_SIZE
} from "./tiles";

import Sprite from "./sprite";

import "./style.css";

const logger = console;

const handlePlayerKeys = state => {
  const { keys, sprite, worldDimensions } = state;
  let keyInfo;

  while (keys.length > 0) {
    keyInfo = keys.pop();

    if (keyInfo.isDown) {
      switch (keyInfo.keyCode) {
        case KEYS.ARROW_LEFT:
          sprite.left().move(worldDimensions);
          break;
        case KEYS.ARROW_RIGHT:
          sprite.right().move(worldDimensions);
          break;
        case KEYS.ARROW_UP:
          sprite.up().move(worldDimensions);
          break;
        case KEYS.ARROW_DOWN:
          sprite.down().move(worldDimensions);
          break;
        default:
          // ignore
          break;
      } // end switch
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

  state.worldDimensions = {
    top: 0,
    left: 0,
    bottom: Math.min(
      canvas.dimensions.height,
      BACKGROUND_ATLAS_ROWS * TILE_SIZE
    ),
    right: Math.min(canvas.dimensions.width, BACKGROUND_ATLAS_COLS * TILE_SIZE)
  };

  // offscreen canvas for double buffering
  state.offscreen = Canvas.create();
  state.offscreenContext = state.offscreen.context();

  state.calcAvgFps = createAvgFpsCalculator();
  state.fpsEl = window.document.querySelector("#fps");
  state.tilesEl = window.document.querySelector("#tiles");
  state.spriteTilesEl = window.document.querySelector("#sprite-tiles");
  state.spriteTileIndexEl = window.document.querySelector("#sprite-tile-index");
  state.spriteLocation = window.document.querySelector("#sprite-location");

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
};

const renderer = (context, canvas, interfaces, state) => {
  const dim = canvas.dimensions;
  state.offscreenContext.imageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;

  // erase the offscreen canvas
  state.offscreenContext.fillStyle = "white";
  state.offscreenContext.fillRect(0, 0, dim.width, dim.height);

  let tileCount = 0;
  let spriteTileCount = 0;
  let spriteTileIndex = -1;
  let x = 0;
  let y = 0;

  state.layers.forEach(layer => {
    // render the tiles
    layer.render(state.offscreenContext);
    tileCount += layer.count;
  });

  if (state.sprite) {
    state.sprite.render(state.offscreenContext);

    // display sprite stats
    spriteTileCount = state.sprite.tiles.length;
    spriteTileIndex = state.sprite.index;
    x = state.sprite.location.x;
    y = state.sprite.location.y;
  }

  // display the total tiles
  state.tilesEl.textContent = `${tileCount}`;

  // display the total sprite tiles
  state.spriteTilesEl.textContent = `${spriteTileCount}`;

  // display the current sprite tile index
  state.spriteTileIndexEl.textContent = `${spriteTileIndex}`;

  // display the current sprite acceleration
  state.spriteLocation.textContent = `x: ${x}, y: ${y}`;

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
