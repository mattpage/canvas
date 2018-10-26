class Audio {
  static create(...args) {
    return new Audio(...args);
  }

  static createElement(src, canPlayCallback, volume, loop) {
    const audio = window.document.createElement("audio");
    if (src) {
      audio.src = src;
    }
    if (canPlayCallback) {
      audio.addEventListener("canplay", canPlayCallback, false);
    }
    if (volume) {
      audio.volume = volume;
    }
    if (loop) {
      audio.loop = loop;
    }
    return audio;
  }

  static playChannel(channel) {
    if (
      channel &&
      channel.canPlay &&
      (channel.audio.paused || channel.audio.ended)
    ) {
      channel.audio.play();
      return true;
    }
    return false;
  }

  static pauseChannel(channel) {
    if (channel && channel.canPlay && !channel.audio.paused) {
      channel.audio.pause();
      return true;
    }
    return false;
  }

  static createPlaybackInterface(channels) {
    return {
      play() {
        // play the first audio channel that can be played
        for (let i = 0; i < channels.length; ++i) {
          if (Audio.playChannel(channels[i])) {
            return true;
          }
        }
        return false;
      },

      pause() {
        // pause the first audio channel that is not paused
        for (let i = 0; i < channels.length; ++i) {
          if (Audio.pauseChannel(channels[i])) {
            return true;
          }
        }
        return false;
      }
    };
  }

  static createCanPlayCallback(channels, channelIndex, callback) {
    const handler = e => {
      const channel = channels[channelIndex];
      channel.audio.removeEventListener("canplay", handler, false);
      channel.canPlay = true;
      if (callback) {
        callback(channel, e);
      }
    };
    return handler;
  }

  static hasAudio() {
    const audio = Audio.createElement();
    return audio ? "canPlayType" in audio : false;
  }

  static supportedFormats() {
    const audio = Audio.createElement();
    if (audio && audio.canPlayType) {
      const ogg = audio.canPlayType('audio/ogg; codecs="vorbis"');
      const mp3 = audio.canPlayType("audio/mpeg;");
      const wav = audio.canPlayType('audio/wav; codecs="1"');
      return {
        ogg: ogg === "probably" || ogg === "maybe",
        mp3: mp3 === "probably" || mp3 === "maybe",
        wav: wav === "probably" || wav === "maybe"
      };
    }
    return {};
  }

  constructor() {
    this._channels = [];
  }

  get channels() {
    return this._channels;
  }

  pauseAll() {
    this._channels.forEach(Audio.pauseChannel);
  }

  playAll() {
    this._channels.forEach(Audio.playChannel);
  }

  load(src, callback, numChannels = 1, ...rest) {
    const channels = [];

    // create an audio element for each channel of audio
    for (let i = 0; i < numChannels; ++i) {
      channels.push({
        audio: Audio.createElement(
          src,
          Audio.createCanPlayCallback(channels, i, callback),
          ...rest
        ),
        canPlay: false
      });
    }

    this._channels = this._channels.concat(channels);

    return Audio.createPlaybackInterface(channels);
  }
}

export default Audio;
