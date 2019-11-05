class TileMap {
  static create(...args) {
    return new TileMap(...args);
  }

  constructor(tiles = []) {
    this._tiles = tiles;
    this._rows = tiles.length;
    this._columns = tiles.length > 0 ? tiles[0].length : 0;
  }

  get(col, row) {
    if (col > -1 && col < this.columns && row > -1 && row < this.rows) {
      return this._tiles[row][col];
    }
    return null;
  }

  get rows() {
    return this._rows;
  }

  get columns() {
    return this._columns;
  }
}

export default TileMap;
