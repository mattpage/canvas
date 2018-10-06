/* eslint no-underscore-dangle: ["error", { "allow": ["_canvas", "_keyboard", "_mouse", "_rafId"] }] */
import Canvas from "./Canvas";
import Mouse from "./Mouse";
import Keyboard from "./Keyboard";

class Game {
  static defaultOptions = {
    contextType: "2d",
    contextAttributes: undefined,
    keyboard: true,
    mouse: true
  };

  static create(selector, options = Game.defaultOptions) {
    return new Game(selector, options);
  }

  constructor(selector, options = Game.defaultOptions) {
    this._rafId = null;
    this._canvas = new Canvas(selector);

    if (options.keyboard) {
      this._keyboard = new Keyboard();
    }
    if (options.mouse) {
      this._mouse = new Mouse(this._canvas.element);
    }
    this.options = options;
  }

  get canvas() {
    return this._canvas;
  }

  get keyboard() {
    return this._keyboard;
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
      if (renderer(context, this.canvas, this.keyboard, this.mouse)) {
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
