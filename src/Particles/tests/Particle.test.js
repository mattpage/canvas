import Particle from "../Particle";

describe("Particle", () => {
  it("should construct", () => {
    const particle = new Particle();
    expect(particle).toBeInstanceOf(Particle);
  });

  it("should set reasonable defaults", () => {
    const particle = new Particle();
    expect(particle.location.x).toEqual(0);
    expect(particle.location.y).toEqual(0);
    expect(particle.width).toEqual(10);
    expect(particle.height).toEqual(10);
    expect(particle.velocity.x).toEqual(0);
    expect(particle.velocity.y).toEqual(0);
    expect(particle.acceleration.x).toEqual(0);
    expect(particle.acceleration.y).toEqual(0);
    expect(particle.style).toEqual({ color: "blue" });
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
      particle.location.x,
      particle.location.y,
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
