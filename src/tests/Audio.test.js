import Audio from "../Audio";

describe("Audio", () => {
  beforeEach(() => {
    /* eslint-disable-next-line no-multi-assign */
    const ce = (window.document.createElement = jest.fn());
    const mockAudio = {
      addEventListener: jest.fn(),
      canPlayType: jest.fn()
    };
    ce.mockReturnValue(mockAudio);
  });

  describe("create", () => {
    it("should return an Audio instance", () => {
      expect(Audio.create()).toBeInstanceOf(Audio);
    });
  });

  describe("createElement", () => {
    it('should call createElement with a "audio" param', () => {
      Audio.createElement();
      expect(window.document.createElement).toHaveBeenCalledWith("audio");
    });

    it("should set src attribute", () => {
      const audio = Audio.createElement("test");
      expect(audio.src).toEqual("test");
    });

    it("should call addEventListener when a canPlayCallback is supplied ", () => {
      const callback = jest.fn();
      const audio = Audio.createElement(null, callback);
      expect(window.document.createElement).toHaveBeenCalledWith("audio");
      expect(audio.addEventListener).toHaveBeenCalledWith(
        "canplay",
        callback,
        false
      );
    });

    it("should set volume attribute", () => {
      const audio = Audio.createElement("test", jest.fn(), 0.2);
      expect(audio.volume).toEqual(0.2);
    });

    it("should set loop attribute", () => {
      const audio = Audio.createElement("test", jest.fn(), 0.2, true);
      expect(audio.loop).toBe(true);
    });
  });

  describe("hasAudio", () => {
    it("should return true only if audio has canPlayType func", () => {
      expect(Audio.hasAudio()).toBe(true);
      const audio = Audio.createElement();
      delete audio.canPlayType;
      expect(Audio.hasAudio()).toBe(false);
    });
  });
});
