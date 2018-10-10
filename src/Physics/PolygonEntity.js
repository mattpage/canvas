import Entity from "./Entity";
import Polygon from "../Polygon";

class PolygonEntity extends Entity {
  constructor(points, x, y, vx = 0, vy = 0, rotation = 0, torque = 0) {
    const polygon = Polygon.create(points, {});
    const rc = polygon.rect;
    super(
      x,
      y,
      rc.right - rc.left,
      rc.bottom - rc.top,
      vx,
      vy,
      rotation,
      torque
    );
    this.polygon = polygon;
  }

  render(context) {
    this.polygon.render(context, { x: this.x, y: this.y }, super.rotation);
  }
}

export default PolygonEntity;
