import { Canvas, Game, Physics, createAvgFpsCalculator } from "../../index";
import Ball from "./Ball";
import "./style.css";

const logger = console;

const initializer = (context, canvas, interfaces, state) => {
  logger.log("initializing game");

  // offscreen canvas for double buffering
  state.offscreen = Canvas.create();
  state.offscreenContext = state.offscreen.context();

  state.calcAvgFps = createAvgFpsCalculator();
  state.fpsEl = window.document.querySelector("#fps");
  state.ballsEl = window.document.querySelector("#balls");

  // create the initial ball
  state.balls.push(Ball.createRandom());

  // when the mouse is clicked, add a new ball
  interfaces.mouse.onClick = () => {
    state.balls.push(Ball.createRandom());
  };

  logger.log("game initialized");
};

const updater = (delta, context, canvas, interfaces, state) => {
  const dim = canvas.dimensions;
  // update ball physics
  Physics.update(
    delta,
    state.balls,
    {
      top: 0,
      left: 0,
      bottom: dim.height,
      right: dim.width
    },
    { deflect: true, wrap: false }
  );
};

const renderer = (context, canvas, interfaces, state) => {
  const dim = canvas.dimensions;
  state.offscreenContext.imageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;

  // erase the offscreen canvas
  state.offscreenContext.fillStyle = "white";
  state.offscreenContext.fillRect(0, 0, dim.width, dim.height);

  // render the balls
  state.balls.forEach(ball => ball.render(state.offscreenContext));

  // copy the offscreen canvas to the display canvas
  context.drawImage(state.offscreen.canvas, 0, 0);

  // display some stats
  state.fpsEl.textContent = `${state.calcAvgFps()}`;
  state.ballsEl.textContent = `${state.balls.length}`;

  // return true to keep animating
  return true;
};

const game = Game.create("canvas");
const initialGameState = {
  balls: []
};
game.start(renderer, updater, initializer, initialGameState);
