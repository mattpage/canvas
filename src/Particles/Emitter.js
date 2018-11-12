import Particle from "./Particle";
import { numberInRange } from "../index";

class Emitter {
  constructor(x, y, spread) {
    this.x = x;
    this.y = y;
    this.spread = spread || Math.PI / 32;
  }

  emit() {
    const vx = numberInRange(0.001, 0.05);
    const vy = numberInRange(0.001, 0.05);
    return new Particle(this.x, this.y, 1, 1, vx, vy);
  }
}

export default Emitter;
