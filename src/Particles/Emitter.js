import Particle, { ParticleType } from "./Particle";
import { numberInRange, randomColor, Vector } from "../index";

class Emitter {
  static create(...args) {
    return new Emitter(...args);
  }

  constructor(
    location,
    particleType = ParticleType.Rectangle,
    particleTypeConfig = { width: 5, height: 10 },
    angle = 270,
    spread = 30
  ) {
    this.location = location;
    this.particleType = particleType;
    this.particleTypeConfig = particleTypeConfig;
    this.angle = angle;
    this.spread = spread;
  }

  emit() {
    const radAngle =
      ((this.angle + this.spread - Math.random() * this.spread * 2) * Math.PI) /
      180;

    const vx = Math.cos(radAngle) * numberInRange(-0.75, 0.75);
    const vy = Math.sin(radAngle) * numberInRange(0.75, 1.5);

    // prettier-ignore
    return Particle.createFromType(
      this.particleType,
      this.particleTypeConfig,
      Vector.copy(this.location),
      Vector.create(vx, vy), // velocity
      numberInRange(0, 360), // rotation
      0.025, // torque
      { fillStyle: randomColor() }
    );
  }
}

export default Emitter;
