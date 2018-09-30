/* eslint no-param-reassign: ["error", { "props": false }] */

import { Game } from "../../index";
import { randomColor } from "../../utils";

const RECTANGLE_WIDTH = 100;
const RECTANGLE_HEIGHT = 50;

const myGame = Game.create("canvas");
const state = {
  rectangles: []
};

let initialized = false;

myGame.start((context, canvas, keyboard, mouse) => {
  const pos = mouse.position;

  if (!initialized) {
    initialized = true;

    // when the mouse is clicked, add a pinned rectangle
    mouse.onClick = e => {
      state.rectangles.push({
        x: e.position.x,
        y: e.position.y,
        width: RECTANGLE_WIDTH,
        height: RECTANGLE_HEIGHT,
        pinned: true,
        color: randomColor()
      });
    };
  }

  // erase and remove all of the rectangles that aren't pinned
  state.rectangles = state.rectangles
    .map(rect => {
      if (rect.pinned) {
        return rect;
      }
      context.clearRect(
        rect.x - 1,
        rect.y - 1,
        rect.width + 2,
        rect.height + 2
      );
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
});
