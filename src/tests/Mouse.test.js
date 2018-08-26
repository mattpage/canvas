import Mouse from '../mouse';

describe('Mouse', () => {

  beforeEach(() => {
    window.addEventListener = jest.fn();
    window.innerWidth = 640;
    window.innerHeight = 480;
  });

  it('should construct, center the mouse position, and listen for events', () => {
    const mouse = new Mouse();
    expect(mouse.position).toEqual({ x: 320, y: 240 })
    expect(window.addEventListener).toHaveBeenCalled();
  });

  it('should update position when mouse is moved', () => {
    const mouse = new Mouse();
    const startPosition = mouse.position;
    const handler = window.addEventListener.mock.calls[0][1];
    handler({ clientX: 100, clientY: 100 });
    const endPosition = mouse.position;
    expect(startPosition).not.toEqual(endPosition);
    expect(endPosition).toEqual({ x: 100, y: 100 });
  });

});
