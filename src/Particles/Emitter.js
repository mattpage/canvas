import Particle from "./Particle";
import { numberInRange, Vector } from "../index";

class Emitter {
  constructor(location, angle = 270, spread = 30) {
    this.location = location;
    this.angle = angle;
    this.spread = spread;
  }

  emit() {
    const radAngle =
      ((this.angle + this.spread - Math.random() * this.spread * 2) * Math.PI) /
      180;
    const vx = Math.cos(radAngle) * numberInRange(-0.75, 0.75);
    const vy = Math.sin(radAngle) * numberInRange(0.75, 1.5);
    return new Particle(this.location, 5, 5, new Vector(vx, vy));
  }
}

export default Emitter;
