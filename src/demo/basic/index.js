import { Game } from "../../index";

const drawRectangle = (context, x, y, width, height) => {
  context.beginPath();
  context.strokeRect(x, y, width, height);
  context.closePath();
};

const myGame = Game.create("canvas");

const dirty = [];

myGame.animate((context, canvas, mouse) => {
  const pos = mouse.position;
  const width = 100;
  const height = 50;

  dirty.forEach(rect => {
    context.clearRect(rect.x - 1, rect.y - 1, rect.width + 2, rect.height + 2);
  });

  const rect = {
    x: pos.x,
    y: pos.y,
    width,
    height
  };
  context.fillText(
    `(${pos.x}, ${pos.y})`,
    pos.x + width / 4,
    pos.y + height / 2
  );
  drawRectangle(context, rect.x, rect.y, rect.width, rect.height);
  dirty.push(rect);

  // return true to keep animating
  return true;
});
