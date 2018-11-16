import Particles from "../Particles";

describe("Particles", () => {
  it("should construct", () => {
    expect(new Particles()).toBeInstanceOf(Particles);
  });

  it("should have an empty collection of Emitters", () => {
    const particles = new Particles();
    expect(Array.isArray(particles.emitters)).toBe(true);
    expect(particles.emitters).toHaveLength(0);
  });

  it("should have an empty collection of Particles", () => {
    const particles = new Particles();
    expect(Array.isArray(particles.particles)).toBe(true);
    expect(particles.particles).toHaveLength(0);
    expect(particles.count).toEqual(0);
  });
});
