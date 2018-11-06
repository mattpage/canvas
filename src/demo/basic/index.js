import { Game, randomColor } from "../../index";

const RECTANGLE_WIDTH = 100;
const RECTANGLE_HEIGHT = 50;

const initializer = (context, canvas, interfaces, state) => {
  const dim = canvas.dimensions;

  // erase everything
  context.fillStyle = "white";
  context.fillRect(0, 0, dim.width, dim.height);

  // when the mouse is clicked, add a pinned rectangle
  interfaces.mouse.onClick = e => {
    state.rectangles.push({
      x: e.position.x,
      y: e.position.y,
      width: RECTANGLE_WIDTH,
      height: RECTANGLE_HEIGHT,
      pinned: true,
      color: randomColor()
    });
  };
};

const renderer = (context, canvas, interfaces, state) => {
  const pos = interfaces.mouse.position;

  // remove all of the rectangles that aren't pinned
  state.rectangles = state.rectangles
    .map(rect => {
      if (rect.pinned) {
        return rect;
      }
      context.fillStyle = "white";
      context.fillRect(rect.x - 1, rect.y - 1, rect.width + 2, rect.height + 2);
      return null;
    })
    .filter(value => Boolean(value));

  // add a new unpinned rectangle based on the current mouse position
  state.rectangles.push({
    x: pos.x,
    y: pos.y,
    width: RECTANGLE_WIDTH,
    height: RECTANGLE_HEIGHT,
    color: "black"
  });

  // draw all the rectangles
  state.rectangles.forEach(rect => {
    context.fillStyle = "black";
    context.fillText(
      `(${rect.x}, ${rect.y})`,
      rect.x + rect.width / 4,
      rect.y + rect.height / 2
    );
    context.beginPath();
    context.strokeStyle = rect.color;
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
    context.closePath();
  });

  // return true to keep animating
  return true;
};

const myGame = Game.create("canvas");
const initialGameState = {
  rectangles: []
};
myGame.start(renderer, null, initializer, initialGameState);
