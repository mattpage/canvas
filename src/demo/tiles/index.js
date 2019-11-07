import { Canvas, Game, createAvgFpsCalculator, KEYS } from "../../index";

import {
  loadBackgroundTiles,
  loadSpriteTiles,
  BACKGROUND_MAP_ROWS,
  BACKGROUND_MAP_COLS,
  TILE_SIZE
} from "./tiles";

import Sprite from "./sprite";

import "./style.css";

const logger = console;

const initializer = (context, canvas, { keyboard }, state) => {
  logger.log("initializing game");

  loadBackgroundTiles().then(bgTiles => {
    state.layers.push(bgTiles);
    loadSpriteTiles().then(spriteTiles => {
      state.sprite = new Sprite(spriteTiles, 0);
    });
    state.worldDimensions = {
      top: 0,
      left: 0,
      bottom: Math.min(
        canvas.dimensions.height,
        (BACKGROUND_MAP_ROWS - 1) * TILE_SIZE
      ),
      right: Math.min(
        canvas.dimensions.width,
        (BACKGROUND_MAP_COLS - 1) * TILE_SIZE
      )
    };
  });

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
  const { keys, sprite, worldDimensions } = state;

  if (sprite) {
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
  }
};

const renderer = (context, canvas, interfaces, state) => {
  const dim = canvas.dimensions;
  const {
    fpsEl,
    layers,
    offscreen,
    offscreenContext,
    sprite,
    spriteLocation,
    spriteTilesEl,
    spriteTileIndexEl,
    tilesEl
  } = state;

  context.imageSmoothingEnabled = false;
  offscreenContext.imageSmoothingEnabled = false;

  // erase the offscreen canvas
  offscreenContext.fillStyle = "white";
  offscreenContext.fillRect(0, 0, dim.width, dim.height);

  let tileCount = 0;

  layers.forEach(layer => {
    // render the tiles
    layer.render(offscreenContext);
    tileCount += layer.count;
  });

  // display the total tiles
  tilesEl.textContent = `${tileCount}`;

  if (sprite) {
    sprite.render(offscreenContext);

    // display the total sprite tiles
    spriteTilesEl.textContent = `${sprite.tiles.length}`;

    // display the current sprite tile index
    spriteTileIndexEl.textContent = `${sprite.index}`;

    // display the current sprite acceleration
    const { location } = sprite;
    spriteLocation.textContent = `x:${location.x}, y:${location.y}`;
  }

  // copy the offscreen canvas to the display canvas
  context.drawImage(offscreen.canvas, 0, 0);

  // display the frame rate
  fpsEl.textContent = `${state.calcAvgFps()}`;

  // return true to keep animating
  return true;
};

// kick everything off
const game = Game.create("canvas", { ...Game.defaultOptions, maxFPS: 30 });
game.start(renderer, updater, initializer, {
  layers: [],
  keys: [],
  sprite: null
});
