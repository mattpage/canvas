import Emitter from "../Emitter";
import Particle from "../Particle";
import { Vector } from "../../index";

describe("Emitter", () => {
  it("should construct", () => {
    const emitter = new Emitter(new Vector(0, 0));
    expect(emitter).toBeInstanceOf(Emitter);
  });
  it("should emit a particle", () => {
    const emitter = new Emitter(new Vector(0, 0));
    const particle = emitter.emit();
    expect(particle).toBeInstanceOf(Particle);
    expect(particle.location.x).toEqual(0);
    expect(particle.location.y).toEqual(0);
    expect(particle.velocity.x).not.toEqual(0);
    expect(particle.velocity.y).not.toEqual(0);
  });
});
