import Mouse from "../Mouse";

describe("Mouse", () => {
  const simulateMouseEvent = (
    name,
    clientX,
    clientY,
    button = 1,
    altKey = false,
    ctrlKey = false,
    shiftKey = false,
    metaKey = false
  ) => {
    const event = new window.Event(name);
    event.preventDefault = jest.fn();
    event.stopPropagation = jest.fn();
    event.button = button;
    event.altKey = altKey;
    event.ctrlKey = ctrlKey;
    event.shiftKey = shiftKey;
    event.metaKey = metaKey;
    event.clientX = clientX;
    event.clientY = clientY;
    window.document.dispatchEvent(event);
    return event;
  };

  beforeEach(() => {
    const doc = window.document;
    doc.innerWidth = 640;
    doc.innerHeight = 480;
  });

  it("should construct and center the mouse position", () => {
    const mouse = new Mouse();
    expect(mouse.position).toEqual({ x: 320, y: 240 });
  });

  it("should update position when mouse is moved", () => {
    const mouse = new Mouse();
    const startPosition = mouse.position;
    simulateMouseEvent("mousemove", 100, 100);
    const endPosition = mouse.position;
    expect(startPosition).not.toEqual(endPosition);
    expect(endPosition).toEqual({ x: 100, y: 100 });
  });

  it("should offset position if an element is supplied", () => {
    const fakeCanvas = {
      offsetLeft: 100,
      offsetTop: 100
    };
    const mouse = new Mouse(fakeCanvas);
    const startPosition = mouse.position;
    simulateMouseEvent("mousemove", 200, 200);
    const endPosition = mouse.position;
    expect(startPosition).not.toEqual(endPosition);
    expect(endPosition).toEqual({ x: 100, y: 100 });
  });

  it("should intercept dragstart, by default", () => {
    /* eslint-disable-next-line no-unused-vars */
    const mouse = new Mouse();
    const e = simulateMouseEvent("dragstart", 0, 0);
    expect(e.preventDefault).toHaveBeenCalled();
    expect(e.stopPropagation).toHaveBeenCalled();
  });

  it("should intercept selectstart, by default", () => {
    /* eslint-disable-next-line no-unused-vars */
    const mouse = new Mouse();
    const e = simulateMouseEvent("selectstart", 0, 0);
    expect(e.preventDefault).toHaveBeenCalled();
    expect(e.stopPropagation).toHaveBeenCalled();
  });

  describe("lastClick", () => {
    it("should return the position of the click", () => {
      const fakeCanvas = {
        offsetLeft: 100,
        offsetTop: 100
      };
      const mouse = new Mouse(fakeCanvas);
      const startPosition = mouse.position;
      simulateMouseEvent("click", 200, 200);
      const click = mouse.lastClick;
      const endPosition = click.position;
      expect(startPosition).not.toEqual(endPosition);
      expect(endPosition).toEqual({ x: 100, y: 100 });
    });
  });

  describe("onClick", () => {
    it("should set a callback that gets called when a mouse click occurs", () => {
      const fakeCanvas = {
        offsetLeft: 100,
        offsetTop: 100
      };
      const mouse = new Mouse(fakeCanvas);
      mouse.onClick = jest.fn();
      simulateMouseEvent("click", 200, 200);
      const callback = mouse.onClick;
      expect(callback).toHaveBeenCalled();
      expect(callback.mock.calls[0][0].x === 200).toBe(true);
      expect(callback.mock.calls[0][0].y === 200).toBe(true);
      expect(callback.mock.calls[0][0].position.x === 100).toBe(true);
      expect(callback.mock.calls[0][0].position.y === 100).toBe(true);
      expect(callback.mock.calls[0][1]).toBeInstanceOf(window.Event);
    });
  });

  describe("onMove", () => {
    it("should set a callback that gets called when a mouse move occurs", () => {
      const fakeCanvas = {
        offsetLeft: 100,
        offsetTop: 100
      };
      const mouse = new Mouse(fakeCanvas);
      mouse.onMove = jest.fn();
      simulateMouseEvent("mousemove", 200, 200);
      const callback = mouse.onMove;
      expect(callback).toHaveBeenCalled();
      expect(callback.mock.calls[0][0].x === 200).toBe(true);
      expect(callback.mock.calls[0][0].y === 200).toBe(true);
      expect(callback.mock.calls[0][0].position.x === 100).toBe(true);
      expect(callback.mock.calls[0][0].position.y === 100).toBe(true);
      expect(callback.mock.calls[0][1]).toBeInstanceOf(window.Event);
    });
  });
});
