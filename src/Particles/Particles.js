import { Physics } from "../Physics";

class Particles {
  static create(...args) {
    return new Particles(...args);
  }

  constructor(emitters = []) {
    this._particles = [];
    this._emitters = Array.isArray(emitters) ? [...emitters] : [emitters];
    this._expiredParticles = 0;
  }

  get emitters() {
    return this._emitters;
  }

  get particles() {
    return this._particles;
  }

  get count() {
    return this._particles.length;
  }

  update(timeStep, bounds, rate = 4, options = {}) {
    let i;
    let j;
    const { emitters, particles } = this;
    const len = emitters.length;

    // emit some particles at the specified rate
    for (i = 0; i < rate; ++i) {
      for (j = 0; j < len; ++j) {
        particles.push(emitters[j].emit());
      }
    }

    Physics.move(timeStep, this._particles, bounds, options);
  }

  render(context) {
    let particle;
    const particles = this._particles;
    const len = particles.length;
    let expired = this._expiredParticles;
    for (let i = 0; i < len; ++i) {
      particle = particles[i];
      if (particle) {
        if (particle.expired) {
          particles[i] = null;
          expired += 1;
        } else {
          particle.render(context);
        }
      }
    }
    this._expiredParticles = expired;
  }
}

export default Particles;
