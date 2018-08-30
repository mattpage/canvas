import Canvas from "./Canvas";
import Mouse from "./Mouse";
/* eslint no-underscore-dangle: ["error", { "allow": ["_canvas", "_mouse", "_rafId"] }] */

class Game {
  static defaultOptions = {
    contextType: "2d",
    contextAttributes: undefined,
    mouse: true
  };

  static create(selector, options = Game.defaultOptions) {
    return new Game(selector, options);
  }

  constructor(selector, options = Game.defaultOptions) {
    this._rafId = null;
    this._canvas = new Canvas(selector);

    if (options.mouse) {
      this._mouse = new Mouse();
    }
    this.options = options;
  }

  get canvas() {
    return this._canvas;
  }

  get mouse() {
    return this._mouse;
  }

  start(callback) {
    const context = this.canvas.context(
      this.options.contextType,
      this.options.contextAttributes
    );

    const renderer = callback || this.render;
    if (!renderer) {
      throw new Error("Missing render callback or method");
    }
    const animationLoop = () => {
      if (renderer(context, this.canvas, this._mouse)) {
        this.rafId = window.requestAnimationFrame(animationLoop);
      }
    };
    animationLoop();
  }

  stop() {
    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

export default Game;
