import Canvas from './Canvas';
import Mouse from './Mouse';

class Game {

  static defaultOptions = {
    contextType: '2d',
    mouse: true,
  };

  static create(selector, options=Game.defaultOptions) {
    return new Game(selector, options);
  }

  constructor(selector, options=Game.defaultOptions) {
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

  animate(callback) {
    const context = this._canvas.context(this.options.contextType);

    const renderer = callback || this.render;
    if (!renderer) {
      throw new Error('Missing render callback or method');
    }
    const animationLoop = () => {
      if (renderer(context, this._canvas, this._mouse)){
        requestAnimationFrame(animationLoop);
      }
    };
    animationLoop();
  }
}

export default Game;
