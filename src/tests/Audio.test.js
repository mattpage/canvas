import Audio from "../Audio";

const setup = () => {
  const mockAudio = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    paused: false,
    ended: true
  };
  const mockPause = () => {
    mockAudio.paused = true;
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
  mockAudio.pause = mockPause;
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
    it("should return a playback interface for a loaded src", () => {
      const audio = Audio.create();
      const playback = audio.load("fire.wav");
      expect(playback).toHaveProperty("play");
      expect(playback.play).toBeInstanceOf(Function);
      expect(playback).toHaveProperty("pause");
      expect(playback.pause).toBeInstanceOf(Function);
    });

    it("should be that a newly added channel exists in the channel collection", () => {
      const audio = Audio.create();
      audio.load("test");
      const channel = audio.channels.find(chan => chan.audio.src === "test");
      expect(channel.audio.src).toEqual("test");
      expect(channel.canPlay).toBe(false);
    });

    it("should call the callback param (if supplied), when the channel can be played", () => {
      const audio = Audio.create();
      const callback = jest.fn();
      audio.load("test", callback);
      const channel = audio.channels.find(chan => chan.audio.src === "test");
      expect(channel.audio.addEventListener).toHaveBeenCalled();
      expect(channel.audio.addEventListener.mock.calls[0][0]).toEqual(
        "canplay"
      );
      const eventCallback = channel.audio.addEventListener.mock.calls[0][1];
      const event = {};
      eventCallback(event);
      expect(callback).toHaveBeenCalledWith(channel, event);
      expect(channel.audio.removeEventListener).toHaveBeenCalled();
      expect(channel.audio.removeEventListener.mock.calls[0][0]).toEqual(
        "canplay"
      );
    });
  });

  describe("play", () => {
    it("should return false if the channel audio is not loaded yet", () => {
      const audio = Audio.create();
      const playback = audio.load("test");
      expect(playback.play()).toBe(false);
    });
    it("should return true and call play if the channel audio is loaded", () => {
      const audio = Audio.create();
      const playback = audio.load("test");
      const channel = audio.channels.find(chan => chan.audio.src === "test");
      const eventCallback = channel.audio.addEventListener.mock.calls[0][1];
      const event = {};
      eventCallback(event);
      expect(playback.play()).toBe(true);
    });
  });

  describe("playAll", () => {
    it("should call play repeatedly", () => {
      const audio = Audio.create();
      audio.load("test1");
      audio.load("test2");
      audio.load("test3");
      audio.channels.forEach(channel => {
        channel.audio.play = jest.fn();
        const eventCallback = channel.audio.addEventListener.mock.calls[0][1];
        const event = {};
        eventCallback(event);
      });
      audio.playAll();
      audio.channels.forEach(channel => {
        expect(channel.audio.play).toHaveBeenCalled();
      });
    });
  });

  describe("pause", () => {
    it("should return false if the channel audio is not loaded yet", () => {
      const audio = Audio.create();
      const playback = audio.load("test");
      expect(playback.pause()).toBe(false);
    });
    it("should return true and call pause if the channel audio is loaded", () => {
      const audio = Audio.create();
      const playback = audio.load("test");
      const channel = audio.channels.find(chan => chan.audio.src === "test");
      const eventCallback = channel.audio.addEventListener.mock.calls[0][1];
      const event = {};
      eventCallback(event);
      expect(playback.pause()).toBe(true);
    });
  });

  describe("pauseAll", () => {
    it("should call pause repeatedly", () => {
      const audio = Audio.create();
      audio.load("test1");
      audio.load("test2");
      audio.load("test3");
      audio.channels.forEach(channel => {
        channel.audio.pause = jest.fn();
        const eventCallback = channel.audio.addEventListener.mock.calls[0][1];
        const event = {};
        eventCallback(event);
      });
      audio.pauseAll();
      audio.channels.forEach(channel => {
        expect(channel.audio.pause).toHaveBeenCalled();
      });
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

  describe("Audio.playChannel", () => {
    it("should return false if the channel audio is not loaded yet", () => {
      const audio = Audio.create();
      audio.load("test");
      expect(Audio.playChannel(audio.channels[0])).toBe(false);
    });
    it("should return true and call play if the channel audio is loaded", () => {
      const audio = Audio.create();
      audio.load("test");
      const channel = audio.channels.find(chan => chan.audio.src === "test");
      const eventCallback = channel.audio.addEventListener.mock.calls[0][1];
      const event = {};
      eventCallback(event);
      expect(Audio.playChannel(channel)).toBe(true);
    });
  });

  describe("Audio.pauseChannel", () => {
    it("should have some tests", () => {});
  });
});
