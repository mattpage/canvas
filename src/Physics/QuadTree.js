// QuadTree for Spatial Partitioning
//
// Adapted from:
// http://blog.sklambert.com/html5-canvas-game-2d-collision-detection
// https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374
//
class QuadTree {
  constructor(bounds, level = 0, maxObjects = 10, maxLevels = 5) {
    this._bounds = bounds;
    this._level = level;
    this._maxLevels = maxLevels;
    this._maxObjects = maxObjects;
    this._nodes = [];
    this._objects = [];
  }

  // Returns the rectangle representing the QuadTree bounds
  // {x,y,width,height}
  get bounds() {
    return this._bounds;
  }

  get level() {
    return this._level;
  }

  get maxLevels() {
    return this._maxLevels;
  }

  get maxObjects() {
    return this._maxObjects;
  }

  get nodes() {
    return this._nodes;
  }

  get objects() {
    return this._objects;
  }

  // The clear method clears the quadtree by recursively clearing all objects from all nodes.
  clear() {
    this._objects.clear();
    this._nodes.forEach(node => node.clear());
  }

  // Splits the node into 4 subnodes
  split() {
    const width = this.bounds.width / 2;
    const height = this.bounds.height / 2;
    const { x, y } = this.bounds;

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
      new QuadTree({ x: col2, y: row1, width, height }, this.level + 1),
      new QuadTree({ x: col1, y: row1, width, height }, this.level + 1),
      new QuadTree({ x: col1, y: row2, width, height }, this.level + 1),
      new QuadTree({ x: col2, y: row2, width, height }, this.level + 1)
    );
  }

  // Find where an object belongs in the quadtree by determining which node the object can fit into.
  // Returns the index of the node or -1. A return of -1 means the object cannot completely fit within
  // any child node and should be placed in the parent node
  findNode(objectRect) {
    let index = -1;
    const verticalMidpoint = this.bounds.x + this.bounds.width / 2;
    const horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

    // Object can completely fit within the top quadrants
    const topQuadrant =
      objectRect.y < horizontalMidpoint &&
      objectRect.y + objectRect.height < horizontalMidpoint;

    // Object can completely fit within the bottom quadrants
    const bottomQuadrant = objectRect.y > horizontalMidpoint;

    // Object can completely fit within the left quadrants
    if (
      objectRect.x < verticalMidpoint &&
      objectRect.x + objectRect.width < verticalMidpoint
    ) {
      if (topQuadrant) {
        index = 1;
      } else if (bottomQuadrant) {
        index = 2;
      }
    }
    // Object can completely fit within the right quadrants
    else if (objectRect.x > verticalMidpoint) {
      if (topQuadrant) {
        index = 0;
      } else if (bottomQuadrant) {
        index = 3;
      }
    }

    return index;
  }

  // Insert an object into the quadtree.
  insert(objectRect) {
    const { level, maxLevels, maxObjects, nodes, objects } = this;

    if (nodes.length > 0) {
      // if we can insert it into an existing node do so
      const index = this.findNode(objectRect);
      if (index !== -1) {
        nodes[index].insert(objectRect);
        return;
      }
    }

    // otherwise add it to this quadtree collection
    objects.add(objectRect);

    // if the the number of objects in this collection exceeds maxObjects
    // then split this collection into 4 nodes
    if (objects.length() > maxObjects && level < maxLevels) {
      if (nodes.length < 1) {
        this.split();
      }

      // and distribute the object into the different nodes
      let i = 0;
      while (i < objects.length()) {
        const index = this.findNode(objects[i]);
        if (index !== -1) {
          nodes[index].insert(...objects.splice(i, 1));
        } else {
          i++;
        }
      }
    }
  }

  // retrieve all objects that fall within nodes that this rectangle fits into
  retrieve(objectRect, collection = []) {
    const index = this.findNode(objectRect);
    if (index !== -1 && this.nodes.length > 0) {
      // drill down until we find the node containing the object
      this.nodes[index].retrieve(objectRect, collection);
    }

    collection.push(...this.objects);

    return collection;
  }
}

export default QuadTree;
