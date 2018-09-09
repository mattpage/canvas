import { Game, Canvas, Physics, integerInRange } from "../../index";
import Asteroid, { AsteroidSize } from "./Asteroid";

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
    const options = {
      showOffset: false,
      showRect: false,
      size: AsteroidSize.Large
    };
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
  let i;
  for (i = 0; i < state.asteroids.length; ++i) {
    if (state.asteroids[i].collision) {
      const asteroid = state.asteroids[i];
      switch (asteroid.size) {
        case AsteroidSize.Tiny:
          // when a tiny asteroid collides, it is destroyed
          // so we remove it from the array
          state.asteroids.splice(i, 1);
          continue;
        case AsteroidSize.Small:
          // when a small asteroid collides, it is replaced
          // with two tiny asteroids
          state.asteroids.splice(
            i,
            1,
            Asteroid.createRandom(asteroid.x, asteroid.y, {
              size: AsteroidSize.Tiny
            }),
            Asteroid.createRandom(asteroid.x + 10, asteroid.y + 10, {
              size: AsteroidSize.Tiny
            })
          );
          break;
        case AsteroidSize.Medium:
          // when a medium asteroid collides, it is replaced
          // with two small asteroids
          state.asteroids.splice(
            i,
            1,
            Asteroid.createRandom(asteroid.x, asteroid.y, {
              size: AsteroidSize.Small
            }),
            Asteroid.createRandom(asteroid.x + 20, asteroid.y + 20, {
              size: AsteroidSize.Small
            })
          );
          break;
        case AsteroidSize.Large:
          // when a large asteroid collides, it is replaced
          // with two medium asteroids
          state.asteroids.splice(
            i,
            1,
            Asteroid.createRandom(asteroid.x, asteroid.y, {
              size: AsteroidSize.Medium
            }),
            Asteroid.createRandom(asteroid.x + 100, asteroid.y + 100, {
              size: AsteroidSize.Medium
            })
          );
          break;
        default:
          console.warn("unknown asteroid size", asteroid.size);
          break;
      }
    }
    state.asteroids[i].render(offscreenContext);
  }

  // unset cartesian coords
  offscreenContext.restore();

  // copy the offscreen canvas to the display canvas
  context.drawImage(offscreen.canvas, 0, 0);

  // return true to keep animating
  return true;
});
