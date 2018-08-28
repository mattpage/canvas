import { Game, Polygon } from "../../index";

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

const state = {
  asteroids: [],
  maxAsteroids: 20
};

// create a new game
const game = Game.create("canvas");

// start the animation loop
game.start((context, canvas) => {
  const dim = canvas.dimensions;
  const halfWidth = dim.width / 2;
  const halfHeight = dim.height / 2;

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

  context.save();

  // set cartesian coordinates
  context.translate(halfWidth, halfHeight);

  // render all of the asteroids
  state.asteroids.forEach(asteroid => {
    // move the asteroid
    asteroid.offset.x += 1;
    asteroid.offset.y += 1;

    // rotate the asteroid
    const newRotation = Math.min(asteroid.rotation + 12, 360 + 6);
    asteroid.rotation = newRotation > 360 ? 0 : newRotation;

    // render the asteroid
    asteroid.polygon.render(context, asteroid.offset, asteroid.rotation);
  });

  context.restore();

  // return true to keep animating
  return true;
});
