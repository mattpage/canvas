class TileMap {
  static create(...args) {
    return new TileMap(...args);
  }

  constructor(tiles, rows, columns, tileSize = 32) {
    if (!tiles) {
      throw new Error("Missing required argument `tiles`");
    }

    this._tiles = tiles;
    this._rows = tiles.length;
    this._columns = tiles.length > 0 ? tiles[0].length : 0;
    this._tileSize = tileSize;
  }

  get(col, row) {
    return this._tiles[row][col];
  }

  get rows() {
    return this._rows;
  }

  get columns() {
    return this._columns;
  }

  get tileSize() {
    return this._tileSize;
  }
}

export default TileMap;
