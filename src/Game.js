import Audio from "./Audio";
import Canvas from "./Canvas";
import Keyboard from "./Keyboard";
import Mouse from "./Mouse";

class Game {
  static defaultOptions = {
    contextType: "2d",
    contextAttributes: { alpha: false },
    audio: true,
    keyboard: true,
    mouse: true
  };

  static create(...args) {
    return new Game(...args);
  }

  constructor(selector, options = Game.defaultOptions) {
    this._rafId = null;
    this._canvas = new Canvas(selector);
    this._interfaces = {};

    if (options.audio) {
      this.interfaces.audio = new Audio();
    }
    if (options.keyboard) {
      this.interfaces.keyboard = new Keyboard();
    }
    if (options.mouse) {
      this.interfaces.mouse = new Mouse(this._canvas.element);
    }
    this.options = options;
  }

  get canvas() {
    return this._canvas;
  }

  get interfaces() {
    return this._interfaces;
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
      init(context, this.canvas, this.interfaces, gameArgs);
    }
    const animationLoop = () => {
      if (render(context, this.canvas, this.interfaces, gameArgs)) {
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
