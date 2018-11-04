// QuadTree for Spatial Partitioning
//
// This QuadTree stores all items in a shared map.
// Each tree stores the keys of the items it contains in a keys property.
// This means that each item must have a key property that returns a unique key.
// Nodes are sub-QuadTrees that divide the parents spatial bounds into four.
// The also contain keys of the items they contain.
//
// Adapted from:
// http://blog.sklambert.com/html5-canvas-game-2d-collision-detection
// https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374
//
class QuadTree {
  constructor(
    bounds = { x: 0, y: 0, width: 100, height: 100 },
    level = 0, // current depth
    maxItemsPerNode = 10, // Number of items before a node splits
    maxLevels = 5, // Max depth of split nodes
    ...rest
  ) {
    this._bounds = bounds;
    this._level = level;
    this._maxLevels = maxLevels;
    this._maxItemsPerNode = maxItemsPerNode;
    this._nodes = [];
    this._keys = [];
    const [map] = rest;
    this._map = map instanceof Map ? map : new Map();
    this._cachedArray = null;
  }

  // Returns the rectangle representing the QuadTree bounds, in the form {x,y,width,height}
  get bounds() {
    return this._bounds;
  }

  get level() {
    return this._level;
  }

  get maxLevels() {
    return this._maxLevels;
  }

  get maxItemsPerNode() {
    return this._maxItemsPerNode;
  }

  get nodes() {
    return this._nodes;
  }

  get keys() {
    return this._keys;
  }

  // the number of items in the entire QuadTree
  get size() {
    return this._map.size;
  }

  // The clear method clears the quadtree by recursively clearing all items from all nodes.
  clear() {
    this._keys.length = 0;
    this._nodes.forEach(node => node.clear());
    this._map.clear();
    this._cachedArray = null;
  }

  // Splits the node into 4 subnodes
  split() {
    const { level, bounds } = this;
    const width = bounds.width / 2;
    const height = bounds.height / 2;

    const { x, y } = bounds;
    const col1 = x;
    const col2 = x + width;
    const row1 = y;
    const row2 = y + height;

    // ---------
    // | 2 | 1 |
    // ---------
    // | 3 | 4 |
    // ---------
    this.nodes.push(
      new QuadTree({ x: col2, y: row1, width, height }, level + 1, this._map),
      new QuadTree({ x: col1, y: row1, width, height }, level + 1, this._map),
      new QuadTree({ x: col1, y: row2, width, height }, level + 1, this._map),
      new QuadTree({ x: col2, y: row2, width, height }, level + 1, this._map)
    );
  }

  // Find where an item belongs in the quadtree by determining which node the item can fit into.
  // Returns the index of the node or -1. A return of -1 means the item cannot completely fit within
  // any child node and should be placed in the parent node
  findNode(item) {
    const { x, y, width, height } = item;
    const { bounds } = this;

    let index = -1;
    const verticalMidpoint = bounds.x + bounds.width / 2;
    const horizontalMidpoint = bounds.y + bounds.height / 2;

    // item can completely fit within the top quadrants
    const topQuadrant =
      y < horizontalMidpoint && y + height < horizontalMidpoint;

    // item can completely fit within the bottom quadrants
    const bottomQuadrant = y > horizontalMidpoint;

    // item can completely fit within the left quadrants
    if (x < verticalMidpoint && x + width < verticalMidpoint) {
      if (topQuadrant) {
        index = 1;
      } else if (bottomQuadrant) {
        index = 2;
      }
    }
    // item can completely fit within the right quadrants
    else if (x > verticalMidpoint) {
      if (topQuadrant) {
        index = 0;
      } else if (bottomQuadrant) {
        index = 3;
      }
    }

    return index;
  }

  // Insert an item into the quadtree.
  insert(item) {
    const { keys, level, maxLevels, maxItemsPerNode, nodes } = this;

    if (nodes.length > 0) {
      // if we can insert it into an existing node do so
      const index = this.findNode(item);
      if (index !== -1) {
        nodes[index].insert(item);
        return;
      }
    }

    // add it to the map of all items in all QuadTrees
    this._map.set(item.key, item);

    // otherwise add it to this quadtree collection
    keys.push(item.key);

    if (this._cachedArray) {
      this._cachedArray.push(item);
    }

    // if the the number of keys in this node exceeds maxItemsPerNode
    // then split this collection into 4 nodes
    if (keys.length > maxItemsPerNode && level < maxLevels) {
      if (nodes.length < 1) {
        this.split();
      }

      // and distribute the items into the different nodes
      this._keys = keys
        .map(key => {
          const newItem = this._map.get(key);
          const index = this.findNode(newItem);
          if (index !== -1) {
            nodes[index].insert(newItem);
            return null;
          }
          return key;
        })
        .filter(k => Boolean(k));
    }
  }

  // remove an item from this QuadTree or a child node
  remove(item) {
    const { keys, nodes } = this;

    if (nodes.length > 0) {
      const index = this.findNode(item);
      if (index !== -1) {
        nodes[index].remove(item);
        return;
      }
    }

    this._map.delete(item.key);
    this._keys = keys.filter(key => key !== item.key);
    if (this._cachedArray) {
      this._cachedArray = this._cachedArray.filter(e => e.key !== item.key);
    }
  }

  // retrieve all items that are within (or straddle) the node that this item fits into
  // This traverses QuadTree parent and child nodes.
  retrieve(item, collection = []) {
    const index = this.findNode(item);
    if (index > -1 && index < this.nodes.length) {
      // drill down until we find the node containing the object
      this.nodes[index].retrieve(item, collection);
    }
    collection.push(...this.keys.map(key => this._map.get(key)));
    return collection;
  }

  // get an array of all items
  get items() {
    if (!this._cachedArray) {
      this._cachedArray = Array.from(this._map.values());
    }
    return this._cachedArray;
  }

  // array-like forEach. Iterates all items in QuadTree parent and child nodes
  forEach(callback) {
    return this._map.forEach(callback);
  }
}

export default QuadTree;
