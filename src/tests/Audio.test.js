import Audio from "../Audio";

const setup = () => {
  const mockAudio = {
    addEventListener: jest.fn()
  };
  const mockCanPlayType = format => {
    if (format.indexOf("ogg") > -1) {
      return "probably";
    }
    if (format.indexOf("mpeg") > -1) {
      return "maybe";
    }
    return "";
  };
  mockAudio.canPlayType = mockCanPlayType;
  const mockCreateElement = jest.fn();
  mockCreateElement.mockReturnValue(mockAudio);
  window.document.createElement = mockCreateElement;
};

describe("Audio", () => {
  beforeEach(setup);

  it("should construct", () => {
    const audio = new Audio();
    expect(audio).toBeInstanceOf(Audio);
  });

  describe("load", () => {
    it("should have some tests", () => {
      // TODO - write tests
    });
  });

  describe("play", () => {
    it("should have some tests", () => {
      // TODO - write tests
    });
  });

  describe("pause", () => {
    it("should have some tests", () => {
      // TODO - write tests
    });
  });

  describe("Audio.create", () => {
    it("should return an Audio instance", () => {
      expect(Audio.create()).toBeInstanceOf(Audio);
    });
  });

  describe("Audio.createElement", () => {
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

  describe("Audio.hasAudio", () => {
    it("should return true only if audio has canPlayType func", () => {
      expect(Audio.hasAudio()).toBe(true);
      const audio = Audio.createElement();
      delete audio.canPlayType;
      expect(Audio.hasAudio()).toBe(false);
    });
  });

  describe("Audio.supportedFormats", () => {
    it("should return supportedFormats", () => {
      const formats = Audio.supportedFormats();
      expect(formats.ogg).toBe(true);
      expect(formats.mp3).toBe(true);
      expect(formats.wav).toBe(false);
    });
  });
});
