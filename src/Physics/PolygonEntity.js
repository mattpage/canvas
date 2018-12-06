import Entity from "./Entity";
import Polygon from "../Polygon";

class PolygonEntity extends Entity {
  static create(...args) {
    return new PolygonEntity(...args);
  }

  constructor(
    points,
    location,
    velocity,
    rotation = 0,
    torque = 0,
    polygonOptions = Polygon.defaultOptions
  ) {
    const polygon = Polygon.create(points, polygonOptions);
    const rc = polygon.rect;
    super(
      location,
      rc.right - rc.left,
      rc.bottom - rc.top,
      velocity,
      rotation,
      torque
    );
    this.polygon = polygon;
  }

  render(context) {
    this.polygon.render(
      context,
      { x: this.location.x, y: this.location.y },
      super.rotation
    );
  }
}

export default PolygonEntity;
