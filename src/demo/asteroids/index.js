import { Game, Canvas, Physics, integerInRange } from "../../index";
import Asteroid from "./Asteroid";

const state = {
  asteroids: [],
  maxAsteroids: 20
};

const game = Game.create("canvas");
const physics = Physics.create({ bounds: { wrap: true } });
const offscreen = Canvas.create();
const offscreenContext = offscreen.context("2d");

// start the animation loop
game.start((context, canvas) => {
  const dim = canvas.dimensions;
  const halfWidth = dim.width / 2;
  const halfHeight = dim.height / 2;

  // do we have enough asteroids?
  if (state.asteroids.length < state.maxAsteroids) {
    const x = integerInRange(-halfWidth, halfWidth);
    const y = integerInRange(-halfHeight, halfHeight);
    const options = { showOffset: false, showRect: true };
    state.asteroids.push(Asteroid.createRandom(x, y, options));
  }

  // erase the offscreen canvas
  offscreenContext.fillStyle = "white";
  offscreenContext.fillRect(0, 0, dim.width, dim.height);

  offscreenContext.save();

  // set cartesian coordinates
  offscreenContext.translate(halfWidth, halfHeight);

  // update asteroid physics
  physics.update(state.asteroids, {
    top: -halfHeight,
    left: -halfWidth,
    bottom: halfHeight,
    right: halfWidth
  });

  // render all of the asteroids
  state.asteroids.forEach(asteroid => {
    asteroid.render(offscreenContext);
  });

  // unset cartesian coords
  offscreenContext.restore();

  // copy the offscreen canvas to the display canvas
  context.drawImage(offscreen.canvas, 0, 0);

  // return true to keep animating
  return true;
});
