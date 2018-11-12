import {
  Canvas,
  Game,
  Particles,
  Emitter,
  createAvgFpsCalculator
} from "../../index";
import "./style.css";

const logger = console;

const initializer = (context, canvas, interfaces, state) => {
  logger.log("initializing game");

  // offscreen canvas for double buffering
  state.offscreen = Canvas.create();
  state.offscreenContext = state.offscreen.context();

  state.calcAvgFps = createAvgFpsCalculator();
  state.fpsEl = window.document.querySelector("#fps");
  state.particlesEl = window.document.querySelector("#particles");

  const dim = canvas.dimensions;
  const halfHeight = dim.height / 2;
  const halfWidth = dim.width / 2;
  state.particles = new Particles(new Emitter(halfWidth, halfHeight));

  logger.log("game initialized");
};

const updater = (delta, context, canvas, interfaces, state) => {
  const dim = canvas.dimensions;
  const bounds = {
    top: 0,
    left: 0,
    bottom: dim.height,
    right: dim.width
  };
  state.particles.update(delta, bounds, 4, {
    constrain: false,
    wrap: false,
    deflect: false
  });
};

const renderer = (context, canvas, interfaces, state) => {
  const dim = canvas.dimensions;
  state.offscreenContext.imageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;

  // erase the offscreen canvas
  state.offscreenContext.fillStyle = "white";
  state.offscreenContext.fillRect(0, 0, dim.width, dim.height);

  // render the particles
  state.particles.render(state.offscreenContext);

  // copy the offscreen canvas to the display canvas
  context.drawImage(state.offscreen.canvas, 0, 0);

  // display some stats
  state.fpsEl.textContent = `${state.calcAvgFps()}`;
  state.particlesEl.textContent = `${state.particles.count}`;

  // return true to keep animating
  return true;
};

const game = Game.create("canvas");
const initialGameState = {
  balls: []
};
game.start(renderer, updater, initializer, initialGameState);
