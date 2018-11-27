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
    const len = this._emitters.length;
    let particle;

    // emit some particles at the specified rate
    for (i = 0; i < rate; ++i) {
      for (j = 0; j < len; ++j) {
        particle = this._emitters[j].emit();
        this._particles.push(particle);
      }
    }

    Physics.move(timeStep, this._particles, bounds, options);

    /*
    if (this._expiredParticles > this._particles.length / 2) {
      console.log(
        "filter expired particles from array",
        this._particles.length,
        this._expiredParticles
      );
      this._particles = this._particles.filter(p => p && !p.expired);
      this._expiredParticles = 0;
    }
    */
  }

  render(context) {
    let particle;
    const len = this._particles.length;
    for (let i = 0; i < len; ++i) {
      particle = this._particles[i];
      if (particle) {
        if (particle.expired) {
          this._particles[i] = null;
          this._expiredParticles += 1;
        } else {
          particle.render(context);
        }
      }
    }
  }
}

export default Particles;
