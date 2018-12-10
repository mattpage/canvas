import { Polygon, PolygonEntity } from "../index";

export const ParticleType = Object.freeze({
  Rectangle: "RectangleParticle",
  Circle: "CircleParticle"
});

export const PARTICLES = [
  {
    type: ParticleType.Rectangle,
    create: (
      location = { x: 0, y: 0 },
      config = { width: 5, height: 10 },
      ...rest
    ) => {
      const { width, height } = config;
      const points = [];
      points.push(0, 0);
      points.push(width, 0);
      points.push(width, height);
      points.push(0, height);
      // eslint-disable-next-line no-use-before-define
      return Particle.create(points, location, ...rest);
    }
  },
  {
    type: ParticleType.Circle,
    points: [],
    create: (location = { x: 0, y: 0 }, config = { radius: 5 }, ...rest) => {
      const { radius } = config;
      const points = [];
      const halfPi = Math.PI / 180;
      let radians;
      for (let th = 1; th <= 360; th++) {
        radians = halfPi * th;
        points.push(radius * Math.cos(radians), radius * Math.sin(radians));
      }
      // eslint-disable-next-line no-use-before-define
      return Particle.create(points, location, ...rest);
    }
  }
];
class Particle extends PolygonEntity {
  static create(...args) {
    return new Particle(...args);
  }

  static createFromType(type, typeConfig, location, ...rest) {
    return PARTICLES.find(p => p.type === type).create(
      location,
      typeConfig,
      ...rest
    );
  }

  constructor(
    points,
    location,
    velocity,
    rotation,
    torque,
    style = {
      fillStyle: "blue"
    }
  ) {
    super(points, location, velocity, rotation, torque, {
      ...Polygon.defaultOptions,
      ...style
    });
    this.style = style;
  }

  render(context) {
    if (!this.expired) {
      super.render(context);
    }
  }
}

export default Particle;
