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
    mouse: true,
    maxFPS: 60
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

  start(renderer, updater, initializer, ...args) {
    const { contextType, contextAttributes, maxFPS } = this.options;
    const context = this.canvas.context(contextType, contextAttributes);

    const init = initializer || this.initialize;
    const update = updater || this.update;
    const render = renderer || this.render;
    if (!render) {
      throw new Error("Missing render callback or method");
    }

    const gameArgs = args.length === 1 ? args[0] : args;

    if (init) {
      init(context, this.canvas, this.interfaces, gameArgs);
    }

    const timestep = 1000 / maxFPS;
    let delta = 0;
    let lastFrameTimeMs = 0;

    const animationLoop = now => {
      if (lastFrameTimeMs > 0 && !this.rafId) {
        // stopped
        return;
      }

      // throttle the frame rate
      if (now < lastFrameTimeMs + timestep) {
        this.rafId = window.requestAnimationFrame(animationLoop);
        return;
      }

      delta += now - lastFrameTimeMs;
      lastFrameTimeMs = now;

      if (update) {
        let numUpdates = 0;
        while (delta >= timestep) {
          update(timestep, context, this.canvas, this.interfaces, gameArgs);
          delta -= timestep;
          numUpdates += 1;
          if (numUpdates > 240) {
            delta = 0;
          }
        }
      }
      if (render(context, this.canvas, this.interfaces, gameArgs)) {
        this.rafId = window.requestAnimationFrame(animationLoop);
      }
    };

    // kick it off
    this.rafId = window.requestAnimationFrame(animationLoop);
  }

  stop() {
    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

export default Game;
