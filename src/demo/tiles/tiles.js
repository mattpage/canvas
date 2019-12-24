import { Image, Tile, TileMap, Tiles, integerInRange } from "../../index";

const TILE_SIZE = 32;
const BACKGROUND_ATLAS_ROWS = 48;
const BACKGROUND_ATLAS_COLS = 64;
const BACKGROUND_MAP_COLS = 25;
const BACKGROUND_MAP_ROWS = 25;
const SPRITE_ATLAS_COLS = 16;

const loadBackgroundTiles = () =>
  new Promise(resolve => {
    const tileAtlas = Image.create();
    tileAtlas.load("assets/tiles.png", () => {
      // select from the grass tiles at random and build a 25x25 background map
      const backgroundMap = [];
      for (let j = 0; j < BACKGROUND_MAP_ROWS; ++j) {
        backgroundMap.push([]);
        for (let i = 0; i < BACKGROUND_MAP_COLS; ++i) {
          backgroundMap[j].push(integerInRange(832, 838));
        }
      }

      const backgroundTileMap = TileMap.create(backgroundMap);

      const backgroundTiles = [];

      // populate the backgroundTiles array with our chosen tiles
      for (let row = 0; row < backgroundTileMap.rows; ++row) {
        for (let col = 0; col < backgroundTileMap.columns; ++col) {
          const index = backgroundTileMap.get(col, row);
          backgroundTiles.push(
            Tile.create(
              tileAtlas,
              col * TILE_SIZE,
              row * TILE_SIZE,
              (index % BACKGROUND_ATLAS_COLS) * TILE_SIZE,
              Math.floor(index / BACKGROUND_ATLAS_COLS) * TILE_SIZE
            )
          );
        }
      }

      resolve(Tiles.create(backgroundTiles));
    });
  });

const loadSpriteTiles = () =>
  new Promise(resolve => {
    const tileAtlas = Image.create();
    tileAtlas.load("assets/cat.png", () => {
      /* prettier-ignore */
      const spriteTileMap = TileMap.create([
        [0, 1, 2],
        [16, 17, 18],
        [32, 33, 34],
        [48, 49, 50],
        [64, 65, 66],
      ], TILE_SIZE);

      const spriteTiles = [];

      // populate the spriteTiles array with our chosen tiles
      for (let row = 0; row < spriteTileMap.rows; ++row) {
        for (let col = 0; col < spriteTileMap.columns; ++col) {
          const index = spriteTileMap.get(col, row);
          spriteTiles.push(
            Tile.create(
              tileAtlas,
              0,
              0,
              (index % SPRITE_ATLAS_COLS) * TILE_SIZE,
              Math.floor(index / SPRITE_ATLAS_COLS) * TILE_SIZE
            )
          );
        }
      }

      resolve(Tiles.create(spriteTiles));
    });
  });

const loadTiles = () => Promise.all([loadBackgroundTiles(), loadSpriteTiles()]);

export {
  loadBackgroundTiles,
  loadSpriteTiles,
  loadTiles,
  BACKGROUND_ATLAS_ROWS,
  BACKGROUND_ATLAS_COLS,
  BACKGROUND_MAP_COLS,
  BACKGROUND_MAP_ROWS,
  TILE_SIZE
};
