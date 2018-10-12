/* eslint no-underscore-dangle: ["error", { "allow": ["_canvas", "_controls", "_rafId"] }] */
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

  static create(...args) {
    return new Game(args);
  }

  constructor(selector, options = Game.defaultOptions) {
    this._rafId = null;
    this._canvas = new Canvas(selector);
    this._controls = {};

    if (options.keyboard) {
      this.controls.keyboard = new Keyboard();
    }
    if (options.mouse) {
      this.controls.mouse = new Mouse(this._canvas.element);
    }
    this.options = options;
  }

  get canvas() {
    return this._canvas;
  }

  get controls() {
    return this._controls;
  }

  start(renderer, initializer, ...args) {
    const context = this.canvas.context(
      this.options.contextType,
      this.options.contextAttributes
    );

    const init = initializer || this.initialize;
    const render = renderer || this.render;
    if (!render) {
      throw new Error("Missing render callback or method");
    }

    const gameArgs = args.length === 1 ? args[0] : args;

    if (init) {
      init(context, this.canvas, this.controls, gameArgs);
    }
    const animationLoop = () => {
      if (render(context, this.canvas, this.controls, gameArgs)) {
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
