import { Game } from "../../index";

class Polygon {
  static defaultOptions = {
  }

  static create(points, options) {
    return new Polygon(points, options);
  }

  constructor(points = [], options=Polygon.defaultOptions) {
    this.points = points;
    this.options = options;
  }

  render(context, offset, rotation) {
    const points = this.points.slice(0);
    
    if (offset || rotation) {
      context.save();
      if (offset) {
        context.translate(offset.x, offset.y);
      }
      if (rotation) {
        context.rotate((Math.PI / 180) * rotation);
      }
    }

    context.beginPath();
    if (points.length > 2){
      context.moveTo(points.shift(), points.shift());
      while(points.length) {
        context.lineTo(points.shift(), points.shift());
      }
    }
    context.closePath();
    context.stroke();

    if (offset || rotation) {
      context.restore();
    }
  }
}

//asteroids in cartesian points
const shapes = [
  Polygon.create([
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
  ]),
  Polygon.create([
    0, 20,
    20, 0,
    20, -10,
    0, -30,
    -10, -30,
    -20, -20,
    -30, -10,
    -30, 0,
    -20, 20
  ]),
  Polygon.create([
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
  ]),
];

const numberInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let shapesOnScreen = 0;

const game = Game.create("canvas");
game.animate((context, canvas, mouse) => {
  const dim = canvas.dimensions;
  const halfWidth = dim.width/2;
  const halfHeight = dim.height/2;

  context.save();

  //set cartesian coordinates
  context.translate(halfWidth, halfHeight);

  const shapeIndex = numberInRange(0, shapes.length - 1);
  const offset = {
    x: numberInRange(-halfWidth, halfWidth),
    y: numberInRange(-halfHeight, halfHeight),
  };

  const rotation = numberInRange(0, 360);

  //render the polygon at a random offset
  shapes[shapeIndex].render(context, offset, rotation);

  shapesOnScreen += 1;

  //unset cartesian coordinates
  context.restore();

  // return true to keep animating
  return shapesOnScreen < 100;
});
