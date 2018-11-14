import Particle from "../Particle";

describe("Particle", () => {
  it("should construct", () => {
    const particle = new Particle();
    expect(particle).toBeInstanceOf(Particle);
  });

  it("should set reasonable defaults", () => {
    const particle = new Particle();
    expect(particle.x).toEqual(0);
    expect(particle.y).toEqual(0);
    expect(particle.width).toEqual(10);
    expect(particle.height).toEqual(10);
    expect(particle.vx).toEqual(0);
    expect(particle.vy).toEqual(0);
    expect(particle.ax).toEqual(0);
    expect(particle.ay).toEqual(0);
    expect(particle.expires).toEqual(0);
    expect(particle.style).toEqual({ color: "blue" });
  });

  it("should be possible to set position", () => {
    const particle = new Particle();
    particle.x = 42;
    particle.y = 24;
    expect(particle.x).toEqual(42);
    expect(particle.y).toEqual(24);
  });

  it("should be possible to get/set velocity", () => {
    const particle = new Particle();
    particle.vx = 42.4;
    expect(particle.vx).toEqual(42.4);
    particle.vy = 22.1;
    expect(particle.vy).toEqual(22.1);
  });

  it("should be possible to get/set acceleration", () => {
    const particle = new Particle();
    particle.ax = 2.4;
    expect(particle.ax).toEqual(2.4);
    particle.ay = 4.2;
    expect(particle.ay).toEqual(4.2);
  });

  it("should render if not expired", () => {
    const mockContext = () => ({
      fillRect: jest.fn()
    });
    const particle = Particle.create();
    const context = mockContext();
    particle.render(context);
    expect(context.fillStyle).toEqual(particle.style.color);
    expect(context.fillRect).toHaveBeenCalledWith(
      particle.x,
      particle.y,
      particle.width,
      particle.height
    );
  });

  it("should not render if expired", () => {
    const mockContext = () => ({
      fillRect: jest.fn()
    });
    const particle = Particle.create();
    particle.expired = true;
    const context = mockContext();
    particle.render(context);
    expect(context.fillRect).not.toHaveBeenCalled();
  });

  describe("Particle.create", () => {
    it("should create", () => {
      const particle = Particle.create();
      expect(particle).toBeInstanceOf(Particle);
    });
  });
});
