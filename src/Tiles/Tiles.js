class Tiles {
  static create(...args) {
    return new Tiles(...args);
  }

  constructor(tiles = []) {
    this._tiles = [...tiles];
  }

  get tiles() {
    return this._tiles;
  }

  get count() {
    return this._tiles.length;
  }

  get(index) {
    return this._tiles[index];
  }

  render(context, index = -1, destX = null, destY = null) {
    let tile;
    const tiles = this._tiles;
    const len = tiles.length;

    if (index > -1 && index < len) {
      tiles[index].render(context, destX, destY);
    } else {
      for (let i = 0; i < len; ++i) {
        tile = tiles[i];
        if (tile) {
          tile.render(context, destX, destY);
        }
      }
    }
  }
}

export default Tiles;
