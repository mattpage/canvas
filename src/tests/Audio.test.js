import Audio from "../Audio";

const setup = () => {
  const mockAudio = {
    addEventListener: jest.fn(),
    play: jest.fn(),
    pause: jest.fn()
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
    it("should return a new channel number for every loaded src", () => {
      const audio = Audio.create();
      expect(audio.load("fire.wav")).toEqual(0);
      expect(audio.load("boom.mp3")).toEqual(1);
      expect(audio.load("zap.ogg")).toEqual(2);
    });
    it("should be that a newly added channel exists in the channel collection", () => {
      const audio = Audio.create();
      const channelIndex = audio.load("test");
      const channel = audio.channel(channelIndex);
      expect(channel.audio.src).toEqual("test");
      expect(channel.canPlay).toBe(false);
    });
    it("should call the callback param (if supplied), when the channel can be played", () => {
      const audio = Audio.create();
      const callback = jest.fn();
      const channelIndex = audio.load("test", callback);
      const channel = audio.channel(channelIndex);
      expect(channel.audio.addEventListener).toHaveBeenCalled();
      expect(channel.audio.addEventListener.mock.calls[0][0]).toEqual(
        "canplay"
      );
      const eventCallback = channel.audio.addEventListener.mock.calls[0][1];
      const event = {};
      eventCallback(event);
      expect(callback).toHaveBeenCalledWith(channelIndex, channel, event);
    });
  });

  describe("play", () => {
    it("should return false if the channel does not exist", () => {
      const audio = Audio.create();
      expect(audio.play(42)).toBe(false);
    });
    it("should return false if the channel exists but the audio is not loaded yet", () => {
      const audio = Audio.create();
      const channelIndex = audio.load("test");
      expect(audio.play(channelIndex)).toBe(false);
    });
    it("should return true and call play if the channel exists and the audio is loaded", () => {
      const audio = Audio.create();
      const channelIndex = audio.load("test");
      const channel = audio.channel(channelIndex);
      const eventCallback = channel.audio.addEventListener.mock.calls[0][1];
      const event = {};
      eventCallback(event);
      expect(audio.play(channelIndex)).toBe(true);
    });
  });

  describe("pause", () => {
    it("should return false if the channel does not exist", () => {
      const audio = Audio.create();
      expect(audio.pause(42)).toBe(false);
    });
    it("should return false if the channel exists but the audio is not loaded yet", () => {
      const audio = Audio.create();
      const channelIndex = audio.load("test");
      expect(audio.pause(channelIndex)).toBe(false);
    });
    it("should return true and call pause if the channel exists and the audio is loaded", () => {
      const audio = Audio.create();
      const channelIndex = audio.load("test");
      const channel = audio.channel(channelIndex);
      const eventCallback = channel.audio.addEventListener.mock.calls[0][1];
      const event = {};
      eventCallback(event);
      expect(audio.pause(channelIndex)).toBe(true);
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
    it("should return false if it cannot create Audio element", () => {
      window.document.createElement = jest.fn();
      expect(Audio.hasAudio()).toBe(false);
    });
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
    it("should return an empty object if it doesn't support the canPlayType method", () => {
      window.document.createElement = jest.fn();
      const formats = Audio.supportedFormats();
      expect(Object.keys(formats)).toHaveLength(0);
    });
  });
});
