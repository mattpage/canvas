import Keyboard, { KEYS } from "../Keyboard";

describe("Keyboard", () => {
  const simulateKeyEvent = (
    name,
    keyCode,
    altKey = false,
    ctrlKey = false,
    shiftKey = false,
    metaKey = false,
    repeat = false
  ) => {
    const event = new window.Event(name);
    event.preventDefault = jest.fn();
    event.which = keyCode;
    event.altKey = altKey;
    event.ctrlKey = ctrlKey;
    event.shiftKey = shiftKey;
    event.metaKey = metaKey;
    event.repeat = repeat;
    window.document.dispatchEvent(event);
    return event;
  };

  it("should construct and listen for events", () => {
    const { addEventListener } = window.document;
    try {
      window.document.addEventListener = jest.fn();
      // eslint-disable-next-line no-unused-vars
      const keyboard = new Keyboard();
      expect(window.document.addEventListener).toHaveBeenCalledTimes(2);
    } finally {
      window.document.addEventListener = addEventListener;
    }
  });

  describe("lastKey", () => {
    it("should return the last key pressed", () => {
      const keyboard = new Keyboard();
      simulateKeyEvent("keydown", KEYS.A);
      expect(keyboard.lastKey.keyCode).toEqual(KEYS.A);
      expect(keyboard.lastKey.isDown).toBe(true);
      simulateKeyEvent("keyup", KEYS.A);
      expect(keyboard.lastKey.keyCode).toEqual(KEYS.A);
      expect(keyboard.lastKey.isDown).toBe(false);
      expect(keyboard.lastKey.ctrlKey).toBe(false);
      expect(keyboard.lastKey.altKey).toBe(false);
      expect(keyboard.lastKey.shiftKey).toBe(false);
      expect(keyboard.lastKey.metaKey).toBe(false);
      expect(keyboard.lastKey.repeat).toBe(false);
    });

    it("should set alt modifier flag", () => {
      const keyboard = new Keyboard();
      simulateKeyEvent("keydown", KEYS.A, true);
      expect(keyboard.lastKey.keyCode).toEqual(KEYS.A);
      expect(keyboard.lastKey.isDown).toBe(true);
      expect(keyboard.lastKey.altKey).toBe(true);
    });

    it("should set ctrl modifier flag", () => {
      const keyboard = new Keyboard();
      simulateKeyEvent("keydown", KEYS.A, false, true);
      expect(keyboard.lastKey.keyCode).toEqual(KEYS.A);
      expect(keyboard.lastKey.isDown).toBe(true);
      expect(keyboard.lastKey.ctrlKey).toBe(true);
    });

    it("should set shift modifier flag", () => {
      const keyboard = new Keyboard();
      simulateKeyEvent("keydown", KEYS.A, false, false, true);
      expect(keyboard.lastKey.keyCode).toEqual(KEYS.A);
      expect(keyboard.lastKey.isDown).toBe(true);
      expect(keyboard.lastKey.shiftKey).toBe(true);
    });

    it("should set meta modifier flag", () => {
      const keyboard = new Keyboard();
      simulateKeyEvent("keydown", KEYS.A, false, false, false, true);
      expect(keyboard.lastKey.keyCode).toEqual(KEYS.A);
      expect(keyboard.lastKey.isDown).toBe(true);
      expect(keyboard.lastKey.metaKey).toBe(true);
    });

    it("should set repeat modifier flag", () => {
      const keyboard = new Keyboard();
      simulateKeyEvent("keydown", KEYS.A, false, false, false, false, true);
      expect(keyboard.lastKey.keyCode).toEqual(KEYS.A);
      expect(keyboard.lastKey.isDown).toBe(true);
      expect(keyboard.lastKey.repeat).toBe(true);
    });

    it("should be possible to set multiple modifier flags", () => {
      const keyboard = new Keyboard();
      simulateKeyEvent("keydown", KEYS.DELETE, true, true);
      expect(keyboard.lastKey.keyCode).toEqual(KEYS.DELETE);
      expect(keyboard.lastKey.isDown).toBe(true);
      expect(keyboard.lastKey.altKey).toBe(true);
      expect(keyboard.lastKey.ctrlKey).toBe(true);
    });
  });

  describe("isDown", () => {
    const keyboard = new Keyboard();
    it("should return true when the specified key is down", () => {
      simulateKeyEvent("keydown", KEYS.ARROW_LEFT);
      expect(keyboard.isDown(KEYS.ARROW_LEFT)).toBe(true);
    });
    it("should return false when the specified key is up", () => {
      simulateKeyEvent("keyup", KEYS.ARROW_LEFT);
      expect(keyboard.isDown(KEYS.ARROW_LEFT)).toBe(false);
    });
    it("should return false when the specified key is not the last key", () => {
      simulateKeyEvent("keydown", KEYS.ARROW_RIGHT);
      expect(keyboard.isDown(KEYS.ARROW_LEFT)).toBe(false);
    });
  });

  describe("captureKey", () => {
    it("should call preventDefault on a capture key", () => {
      const keyboard = new Keyboard();
      keyboard.captureKey(KEYS.ARROW_UP);
      const e = simulateKeyEvent("keydown", KEYS.ARROW_UP);
      expect(e.preventDefault).toHaveBeenCalled();
    });

    it("should call the capture callback if one is supplied", () => {
      const keyboard = new Keyboard();
      const callback = jest.fn();

      // capture up arrow
      keyboard.captureKey(KEYS.ARROW_UP, callback);

      // simulate ARROW_UP keydown
      let e = simulateKeyEvent("keydown", KEYS.ARROW_UP);

      // expect some calls
      expect(e.preventDefault).toHaveBeenCalled();
      expect(callback).toHaveBeenCalled();

      // check the callback args
      expect(callback.mock.calls[0][0].keyCode === KEYS.ARROW_UP).toBe(true);
      expect(callback.mock.calls[0][1]).toBeInstanceOf(window.Event);

      callback.mockReset();

      // simulate ARROW_UP keyup
      e = simulateKeyEvent("keyup", KEYS.ARROW_UP);

      // expect some calls again
      expect(e.preventDefault).toHaveBeenCalled();
      expect(callback).toHaveBeenCalled();

      // check the callback args again
      expect(callback.mock.calls[0][0].keyCode === KEYS.ARROW_UP).toBe(true);
      expect(callback.mock.calls[0][1]).toBeInstanceOf(window.Event);
    });
  });

  describe("releaseKey", () => {
    const keyboard = new Keyboard();
    const callback = jest.fn();
    keyboard.captureKey(KEYS.ARROW_UP, callback);
    simulateKeyEvent("keydown", KEYS.ARROW_UP);
    expect(callback).toHaveBeenCalled();
    callback.mockReset();
    keyboard.releaseKey(KEYS.ARROW_UP);
    simulateKeyEvent("keyup", KEYS.ARROW_UP);
    expect(callback).not.toHaveBeenCalled();
  });

  describe("Keyboard.create", () => {
    it("should create", () => {
      const kb = Keyboard.create();
      expect(kb).toBeInstanceOf(Keyboard);
    });
  });
});
