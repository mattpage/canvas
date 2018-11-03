import Canvas from "../Canvas";
/* eslint-disable no-new */

describe("Canvas", () => {
  describe("invalid selector", () => {
    beforeEach(() => {
      window.document.querySelector = jest.fn();
    });

    it("should throw an exception if the selector does not return anything", () => {
      expect(() => new Canvas("invalid")).toThrowError(/^Invalid selector/);
    });
  });

  describe("with valid selector", () => {
    let mockCanvas;

    beforeEach(() => {
      /* eslint-disable-next-line no-multi-assign */
      const qs = (window.document.querySelector = jest.fn());
      mockCanvas = {
        getContext: jest.fn()
      };
      mockCanvas.getContext.mockReturnValue({});
      qs.mockReturnValue(mockCanvas);
      window.innerWidth = 640;
      window.innerHeight = 480;
      window.addEventListener = jest.fn();
    });

    it("should construct, query for the canvas, and set its width and height", () => {
      const canvas = new Canvas("test");
      expect(window.document.querySelector).toHaveBeenCalledWith("test");
      expect(canvas.dimensions.width).toEqual(640);
      expect(canvas.dimensions.height).toEqual(480);
    });

    it("should listen for resize events if the resizable option is specified", () => {
      new Canvas("test");
      const addListener = window.addEventListener;
      expect(addListener).toHaveBeenCalled();
      expect(addListener.mock.calls).toHaveLength(1);
      const args = addListener.mock.calls[0];
      expect(args).toHaveLength(2);
      expect(args[0]).toEqual("resize");
      expect(args[1]).toBeInstanceOf(Function);
    });

    it("should not listen for resize events if the resizable option is set to false", () => {
      new Canvas("test", { resizable: false });
      const addListener = window.addEventListener;
      expect(addListener).not.toHaveBeenCalled();
      expect(addListener.mock.calls).toHaveLength(0);
    });

    it("should return the default context", () => {
      const canvas = new Canvas("test");
      const ctx = canvas.context();
      expect(ctx).toBeInstanceOf(Object);
      expect(mockCanvas.getContext).toHaveBeenCalled();
      expect(mockCanvas.getContext.mock.calls).toHaveLength(1);
      const args = mockCanvas.getContext.mock.calls[0];
      expect(args).toHaveLength(2);
      expect(args[0]).toEqual("2d");
      expect(args[1]).toEqual({ alpha: false });
    });

    it("should update canvas dimensions when resized", () => {
      const canvas = new Canvas("test");
      const startDimensions = canvas.dimensions;
      const handler = window.addEventListener.mock.calls[0][1];
      window.innerWidth = 1024;
      window.innerHeight = 768;
      handler({});
      const endDimensions = canvas.dimensions;
      expect(startDimensions).not.toEqual(endDimensions);
      expect(endDimensions).toEqual({ width: 1024, height: 768 });
    });
  });

  describe("without a valid selector", () => {
    let mockCanvas;

    beforeEach(() => {
      /* eslint-disable-next-line no-multi-assign */
      const qs = (window.document.createElement = jest.fn());
      mockCanvas = {
        getContext: jest.fn()
      };
      mockCanvas.getContext.mockReturnValue({});
      qs.mockReturnValue(mockCanvas);
      window.innerWidth = 640;
      window.innerHeight = 480;
      window.addEventListener = jest.fn();
    });

    it("should construct, create a new canvas, and set its width and height", () => {
      const canvas = new Canvas();
      expect(window.document.createElement).toHaveBeenCalledWith("canvas");
      expect(canvas.dimensions.width).toEqual(640);
      expect(canvas.dimensions.height).toEqual(480);
    });
  });

  describe("create", () => {
    it("should return a Canvas instance", () => {
      expect(Canvas.create("test")).toBeInstanceOf(Canvas);
    });
  });
});
