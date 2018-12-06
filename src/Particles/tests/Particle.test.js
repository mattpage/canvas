import Particle from "../Particle";

describe("Particle", () => {
  const testPoints = [0, 0, 0, 5, 5, 5, 5, 0];
  it("should construct", () => {
    const particle = new Particle(testPoints);
    expect(particle).toBeInstanceOf(Particle);
  });

  it("should set reasonable defaults", () => {
    const particle = new Particle(testPoints);
    expect(particle.location.x).toEqual(0);
    expect(particle.location.y).toEqual(0);
    expect(particle.width).toEqual(5);
    expect(particle.height).toEqual(5);
    expect(particle.velocity.x).toEqual(0);
    expect(particle.velocity.y).toEqual(0);
    expect(particle.acceleration.x).toEqual(0);
    expect(particle.acceleration.y).toEqual(0);
  });

  it("should render if not expired", () => {
    const mockContext = () => ({
      beginPath: jest.fn(),
      closePath: jest.fn(),
      fill: jest.fn(),
      fillRect: jest.fn(),
      lineTo: jest.fn(),
      moveTo: jest.fn(),
      restore: jest.fn(),
      save: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn()
    });
    const particle = Particle.create(testPoints);
    const context = mockContext();
    particle.render(context);
    expect(context.fillStyle).toEqual(particle.style.fillStyle);
    expect(context.fill).toHaveBeenCalled();
  });

  it("should not render if expired", () => {
    const mockContext = () => ({
      beginPath: jest.fn(),
      closePath: jest.fn(),
      fill: jest.fn(),
      fillRect: jest.fn(),
      lineTo: jest.fn(),
      moveTo: jest.fn(),
      restore: jest.fn(),
      save: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn()
    });
    const particle = Particle.create();
    particle.expired = true;
    const context = mockContext();
    particle.render(context);
    expect(context.fill).not.toHaveBeenCalled();
  });

  describe("Particle.create", () => {
    it("should create", () => {
      const particle = Particle.create();
      expect(particle).toBeInstanceOf(Particle);
    });
  });
});
