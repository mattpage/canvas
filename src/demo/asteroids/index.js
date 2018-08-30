import { Game, Canvas, numberInRange } from "../../index";
import Asteroid from "./Asteroid";

const state = {
  asteroids: [],
  maxAsteroids: 20,
  drawCoords: false
};

const game = Game.create("canvas");
const offscreen = Canvas.create();
const offscreenContext = offscreen.context("2d");

// start the animation loop
game.start((context, canvas) => {
  const dim = canvas.dimensions;
  const halfWidth = dim.width / 2;
  const halfHeight = dim.height / 2;

  // do we have enough asteroids?
  if (state.asteroids.length < state.maxAsteroids) {
    const x = numberInRange(-halfWidth, halfWidth);
    const y = numberInRange(-halfHeight, halfHeight);
    const rotation = numberInRange(0, 360);
    state.asteroids.push(Asteroid.createRandom(x, y, rotation));
  }

  // erase the offscreen canvas
  offscreenContext.fillStyle = "white";
  offscreenContext.fillRect(0, 0, dim.width, dim.height);

  offscreenContext.save();

  // set cartesian coordinates
  offscreenContext.translate(halfWidth, halfHeight);

  // render all of the asteroids
  state.asteroids.forEach(asteroid => {
    // move the asteroid
    asteroid.offset(1, 1);

    // if the asteroid has moved offscreen wrap it around the other side
    if (asteroid.position.x > halfWidth) {
      asteroid.move(-halfWidth, asteroid.position.y);
    }
    if (asteroid.position.y > halfHeight) {
      asteroid.move(asteroid.position.x, -halfHeight);
    }

    // rotate the asteroid
    asteroid.rotate(asteroid.rotation + 1);

    // render the asteroid
    asteroid.render(offscreenContext);

    if (state.drawCoords) {
      // draw the x,y coordinates
      const { x, y } = asteroid.offset;
      offscreenContext.strokeText(`(${x},${y})`, x, y);
    }
  });

  // unset cartesian coords
  offscreenContext.restore();

  // copy the offscreen canvas to the display canvas
  context.drawImage(offscreen.canvas, 0, 0);

  // return true to keep animating
  return true;
});
