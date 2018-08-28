import Canvas from "./Canvas";
import Mouse from "./Mouse";
/* eslint no-underscore-dangle: ["error", { "allow": ["_canvases", "_mouse"] }] */

class Game {
  static defaultOptions = {
    contextType: "2d",
    doubleBuffer: false,
    mouse: true
  };

  static create(selector, options = Game.defaultOptions) {
    return new Game(selector, options);
  }

  constructor(selector, options = Game.defaultOptions) {
    this._canvases = [];

    this.addCanvas(selector, options);

    if (options.mouse) {
      this._mouse = new Mouse();
    }
    this.options = options;
  }

  addCanvas(selector, options = {}) {
    this._canvases.push(new Canvas(selector, options));
  }

  get canvas() {
    return this._canvases[0];
  }

  get mouse() {
    return this._mouse;
  }

  animate(callback) {
    const context = this.canvas.context(this.options.contextType);

    const renderer = callback || this.render;
    if (!renderer) {
      throw new Error("Missing render callback or method");
    }
    const animationLoop = () => {
      if (renderer(context, this.canvas, this._mouse)) {
        window.requestAnimationFrame(animationLoop);
      }
    };
    animationLoop();
  }

  flip(context) {
    // rotate canvases
    this._canvases.push(this._canvases.shift());

    if (context) {
      context.drawImage(this.canvas, 0, 0);
    }
  }
}

export default Game;
