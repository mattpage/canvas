import { Game, Canvas, Polygon } from "../../index";

// asteroids in cartesian points
/* prettier-ignore */
const ASTEROIDS = [
  [
    0, 20,
    20, 0,
    20, -10,
    0, -30,
    -10, -30,
    -5, -15,
    -20, -30,
    -30, -10,
    -10, 0,
    -30, 0,
    -20, 20
  ],
  [
    0, 20,
    20, 0,
    20, -10,
    0, -30,
    -10, -30,
    -20, -20,
    -30, -10,
    -30, 0,
    -20, 20
  ],
  [
    0, 20,
    5, 20,
    10, 15,
    15, 15,
    20, 10,
    20, 0,
    10, -15,
    0, -20,
    -5, -20,
    -15, -15,
    -15, -10,
    -20, -5,
    -20, 0,
    -15, 5,
    -10, 10,
    -10, 15
  ],
  [
    0, 15,
    5, 10,
    10, 10,
    15, 5,
    15, 0,
    10, -5,
    5, -5,
    5, -10,
    0, -5,
    -5, -10,
    -10, -5,
    -10, 0,
    -5, 5,
    -5, 10
  ]
];

const numberInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const createRandomAsteroid = () => {
  const index = numberInRange(0, ASTEROIDS.length - 1);
  return Polygon.create(ASTEROIDS[index]);
};

const createRandomOffset = (minX, maxX, minY, maxY) => ({
  x: numberInRange(minX, maxX),
  y: numberInRange(minY, maxY)
});

const createRandomRotation = () => numberInRange(0, 360);

const equalDimensions = (dim1, dim2) =>
  dim1.width === dim2.width && dim1.height === dim2.height;

const state = {
  asteroids: [],
  maxAsteroids: 20
};

// create a new game
const game = Game.create("canvas");

const offscreen = Canvas.create();
const offscreenContext = offscreen.context("2d");

// start the animation loop
game.start((context, canvas) => {
  const dim = canvas.dimensions;
  const halfWidth = dim.width / 2;
  const halfHeight = dim.height / 2;

  // if the primary canvas dimensions change, update the offscreen canvas
  if (!equalDimensions(offscreen.dimensions, dim)) {
    offscreen.width = dim.width;
    offscreen.height = dim.height;
  }

  // do we have enough asteroids?
  if (state.asteroids.length < state.maxAsteroids) {
    const polygon = createRandomAsteroid();
    state.asteroids.push({
      polygon,
      offset: createRandomOffset(
        -halfWidth,
        halfWidth,
        -halfHeight,
        halfHeight
      ),
      rotation: createRandomRotation()
    });
  }

  offscreenContext.fillStyle = "white";
  offscreenContext.fillRect(0, 0, dim.width, dim.height);

  offscreenContext.save();

  // set cartesian coordinates
  offscreenContext.translate(halfWidth, halfHeight);

  // render all of the asteroids
  state.asteroids.forEach(asteroid => {
    // move the asteroid
    asteroid.offset.x += 1;
    asteroid.offset.y += 1;

    // rotate the asteroid
    const newRotation = Math.min(asteroid.rotation + 12, 360 + 6);
    asteroid.rotation = newRotation > 360 ? 0 : newRotation;

    // render the asteroid
    asteroid.polygon.render(
      offscreenContext,
      asteroid.offset,
      asteroid.rotation
    );
  });

  offscreenContext.restore();

  context.drawImage(offscreen.canvas, 0, 0);

  // return true to keep animating
  return true;
});
