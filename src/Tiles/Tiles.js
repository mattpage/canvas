class Tiles {
  static create(...args) {
    return new Tiles(...args);
  }

  constructor() {
    this._tiles = [];
  }

  get tiles() {
    return this._tiles;
  }

  get count() {
    return this._tiles.length;
  }

  render(context) {
    let tile;
    const tiles = this._tiles;
    const len = tiles.length;
    for (let i = 0; i < len; ++i) {
      tile = tiles[i];
      if (tile) {
        tile.render(context);
      }
    }
  }
}

export default Tiles;
