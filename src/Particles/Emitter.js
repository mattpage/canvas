import Particle from "./Particle";
import { numberInRange } from "../index";

class Emitter {
  constructor(x, y, angle = 270, spread = 30) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.spread = spread;
  }

  emit() {
    const radAngle =
      ((this.angle + this.spread - Math.random() * this.spread * 2) * Math.PI) /
      180;
    const vx = Math.cos(radAngle) * numberInRange(-0.75, 0.75);
    const vy = Math.sin(radAngle) * numberInRange(0.75, 1.5);
    return new Particle(this.x, this.y, 5, 5, vx, vy);
  }
}

export default Emitter;
