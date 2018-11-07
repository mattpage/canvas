import Polygon from "../Polygon";

const mockContext = () => ({
  arc: jest.fn(),
  beginPath: jest.fn(),
  closePath: jest.fn(),
  lineTo: jest.fn(),
  moveTo: jest.fn(),
  restore: jest.fn(),
  rotate: jest.fn(),
  save: jest.fn(),
  stroke: jest.fn(),
  strokeRect: jest.fn(),
  translate: jest.fn()
});

describe("Polygon", () => {
  const testPoints = [1, 2, 3, 4, 5, 6, 7, 8];

  it("should construct", () => {
    const poly = new Polygon(testPoints);
    expect(poly).toBeInstanceOf(Polygon);
  });

  describe("arrayOfPointArrays", () => {
    it("should return an array of point arrays", () => {
      const poly = new Polygon(testPoints);
      expect(poly.arrayOfPointArrays).toEqual([[1, 2], [3, 4], [5, 6], [7, 8]]);
    });

    it("should cache the point array", () => {
      const poly = new Polygon(testPoints);
      expect(poly._pointArrays).toBeUndefined();
      const arr = poly.arrayOfPointArrays;
      expect(poly._pointArrays).toEqual(arr);
      poly._pointArrays = [1, 2, 3, 4, 5, 6];
      const cached = poly.arrayOfPointArrays;
      expect(poly._pointArrays).toEqual(cached);
    });
  });

  describe("rect", () => {
    it("should return a bounding rectangle", () => {
      const poly = new Polygon(testPoints);
      const rc = poly.rect;
      expect(rc).toEqual({ top: 2, left: 1, bottom: 8, right: 7 });
    });
  });

  describe("create", () => {
    it("should return a Polygon instance", () => {
      expect(Polygon.create(testPoints)).toBeInstanceOf(Polygon);
    });
  });

  describe("centroid", () => {
    it("should return the center point", () => {
      let poly = Polygon.create(testPoints);
      expect(poly.centroid).toEqual([4, 5]);
      poly = Polygon.create([0, 0, 0, 50, 50, 0, 50, 50]);
      expect(poly.centroid).toEqual([25, 25]);
    });
  });

  describe("render", () => {
    it("should moveTo starting point", () => {
      const poly = Polygon.create(testPoints);
      const context = mockContext();
      poly.render(context);
      expect(context.moveTo).toHaveBeenCalledWith(1, 2);
    });
    it("should lineTo remaining points", () => {
      const poly = Polygon.create(testPoints);
      const context = mockContext();
      poly.render(context);
      expect(context.lineTo).toHaveBeenNthCalledWith(1, 3, 4);
      expect(context.lineTo).toHaveBeenNthCalledWith(2, 5, 6);
      expect(context.lineTo).toHaveBeenNthCalledWith(3, 7, 8);
    });
    it("should offset the polygon", () => {
      const poly = Polygon.create(testPoints);
      const context = mockContext();
      const offset = { x: 50, y: 50 };
      poly.render(context, offset);
      expect(context.save).toHaveBeenCalled();
      expect(context.translate).toHaveBeenCalledWith(offset.x, offset.y);
      expect(context.restore).toHaveBeenCalled();
    });
    it("should rotate the polygon", () => {
      const poly = Polygon.create(testPoints);
      const context = mockContext();
      poly.render(context, null, 2.0);
      expect(context.save).toHaveBeenCalled();
      expect(context.rotate).toHaveBeenCalledWith(2.0);
      expect(context.restore).toHaveBeenCalled();
    });
    it("should draw a bounding circle around the polygon", () => {
      const poly = Polygon.create(testPoints, { showCircle: true });
      const context = mockContext();
      poly.render(context, null, 2.0);
      expect(context.beginPath).toHaveBeenCalled();
      expect(context.arc).toHaveBeenCalledWith(4, 5, 6, 0, Math.PI * 2, true);
      expect(context.closePath).toHaveBeenCalled();
      expect(context.stroke).toHaveBeenCalled();
    });
    it("should draw a bounding rectangle around the polygon", () => {
      const poly = Polygon.create(testPoints, { showRect: true });
      const context = mockContext();
      poly.render(context, null, 2.0);
      expect(context.strokeRect).toHaveBeenCalledWith(1, 2, 6, 6);
    });
  });
});
