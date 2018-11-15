import Emitter from "../Emitter";
import Particle from "../Particle";

describe("Emitter", () => {
  it("should construct", () => {
    const emitter = new Emitter(0, 0);
    expect(emitter).toBeInstanceOf(Emitter);
  });
  it("should emit a particle", () => {
    const emitter = new Emitter(0, 0);
    const particle = emitter.emit();
    expect(particle).toBeInstanceOf(Particle);
    expect(particle.x).toEqual(0);
    expect(particle.y).toEqual(0);
    expect(particle.vx).not.toEqual(0);
    expect(particle.vy).not.toEqual(0);
  });
});
