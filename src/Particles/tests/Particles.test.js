import Particles from "../Particles";
import Emitter from "../Emitter";
import Particle from "../Particle";

describe("Particles", () => {
  it("should construct", () => {
    expect(new Particles()).toBeInstanceOf(Particles);
  });

  it("should have an empty collection of Emitters", () => {
    const particles = new Particles();
    expect(Array.isArray(particles.emitters)).toBe(true);
    expect(particles.emitters).toHaveLength(0);
  });

  it("should not have an empty collection of Emitters", () => {
    const particles = new Particles(new Emitter(0, 0));
    expect(Array.isArray(particles.emitters)).toBe(true);
    expect(particles.emitters).toHaveLength(1);
  });

  it("should have an empty collection of Particles", () => {
    const particles = new Particles();
    expect(Array.isArray(particles.particles)).toBe(true);
    expect(particles.particles).toHaveLength(0);
    expect(particles.count).toEqual(0);
  });

  describe("update", () => {
    it("should do nothing if there are no emitters and/or particles", () => {
      const particles = new Particles();
      particles.update(1, { left: 0, top: 0, right: 100, bottom: 100 });
      expect(particles.count).toEqual(0);
      expect(particles.emitters.length).toEqual(0);
    });

    it("should call the emitter's emit method and add some particles", () => {
      const mockEmitter = {
        emit: jest.fn()
      };
      mockEmitter.emit.mockImplementation(() => new Particle());
      const particles = new Particles(mockEmitter);
      particles.update(1, { left: 0, top: 0, right: 100, bottom: 100 });
      expect(mockEmitter.emit).toHaveBeenCalled();
      expect(particles.count).toEqual(4);
    });

    it("should move particles", () => {
      const particles = new Particles(new Emitter(50, 50));
      expect(particles.count).toBe(0);
      const options = { constrain: false, wrap: false, deflect: false };
      particles.update(
        1,
        { left: 0, top: 0, right: 100, bottom: 100 },
        4,
        options
      );
      expect(particles.count).toEqual(4);
      const cached = [];
      particles.particles.forEach((p, index) => {
        p.id = index;
        cached.push(new Particle(p.x, p.y, p.width, p.height, p.vx, p.vy));
      });

      particles.update(
        1,
        { left: 0, top: 0, right: 100, bottom: 100 },
        4,
        options
      );
      expect(particles.count).toEqual(8);

      for (let i = 0; i < 4; ++i) {
        const particle = particles.particles[i];
        expect(particle.id === i);
        expect(particles.particles[i].x).not.toEqual(cached[i].x);
        expect(particles.particles[i].y).not.toEqual(cached[i].y);
      }
    });
  });

  describe("render", () => {
    it("should call render on all particles that are not expired", () => {
      const particles = new Particles();
      const mockParticle = {
        expired: false,
        render: jest.fn()
      };
      particles.particles.push(mockParticle);
      const context = {};
      particles.render(context);
      expect(mockParticle.render).toHaveBeenCalledWith(context);
    });
  });
});
