import {
  Canvas,
  Game,
  Particles,
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

  // create a circle in cartesian coordinates
  const r = 5;
  const points = [];
  let radians;
  for (let th = 1; th <= 360; th++) {
    radians = (Math.PI / 180) * th;
    points.push(r * Math.cos(radians), r * Math.sin(radians));
  }

  // our emitter is going to emit circles
  state.particles = Particles.create(Emitter.create(location, 0, 90, points));

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
    let dir;
    const mousePos = Vector.create(mouse.position.x, mouse.position.y);
    for (let i = 0; i < len; ++i) {
      particle = particles[i];
      dir = Vector.subtract(mousePos, particle.location);
      dir.normalize();
      dir.multiply(0.1);
      particle.velocity.add(dir).limit(1);
    }
  }

  const rate = len < 50 ? 1 : 0;
  state.particles.update(
    delta,
    {
      top: 0,
      left: 0,
      bottom: dim.height,
      right: dim.width
    },
    rate,
    { constrain: true, deflect: true, gravity: 0, wrap: false }
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
