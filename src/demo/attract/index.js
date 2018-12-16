import {
  Canvas,
  Game,
  Particles,
  ParticleType,
  Emitter,
  createAvgFpsCalculator,
  Vector
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
  const location = Vector.create(halfWidth, halfHeight + halfHeight / 2);

  // our emitter is going to emit circles
  state.particles = Particles.create(
    Emitter.create(location, ParticleType.Circle, { radius: 5 }, 0, 90)
  );

  logger.log("game initialized");
};

const updater = (delta, context, canvas, interfaces, state) => {
  const dim = canvas.dimensions;
  const { mouse } = interfaces;
  const { particles } = state.particles;
  const len = particles.length;

  // valid mouse position?
  if (!Number.isNaN(mouse.position.x) && !Number.isNaN(mouse.position.y)) {
    let particle;
    let accel;
    const mousePos = Vector.create(mouse.position.x, mouse.position.y);
    for (let i = 0; i < len; ++i) {
      particle = particles[i];
      // accelerate towards the mouse
      accel = Vector.subtract(mousePos, particle.location);
      accel.normalize();
      accel.multiply(0.1);
      particle.acceleration = accel;
    }
  }

  const rate = len < 50 ? 5 : 0;
  state.particles.update(
    delta,
    {
      top: 0,
      left: 0,
      bottom: dim.height,
      right: dim.width
    },
    rate,
    { constrain: true, deflect: true, gravity: 0, wrap: false, vLimit: 1 }
  );
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
  particles: []
};
game.start(renderer, updater, initializer, initialGameState);
