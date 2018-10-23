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

  channel(channelIndex) {
    return this._channels[channelIndex];
  }

  load(src, callback, ...rest) {
    const channelIndex = this._channels.length;
    const canPlayCallback = e => {
      const channel = this._channels[channelIndex];
      channel.audio.removeEventListener("canplay", canPlayCallback, false);
      channel.canPlay = true;
      if (callback) {
        callback(channelIndex, channel, e);
      }
    };

    this._channels.push({
      audio: Audio.createElement(src, canPlayCallback, ...rest),
      canPlay: false
    });
    return this._channels.length - 1;
  }

  pause(channelIndex) {
    const channel = this._channels[channelIndex];
    if (channel) {
      channel.audio.pause();
      return channel.audio.paused;
    }
    return false;
  }

  playAny(channels) {
    const len = channels.length;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < len; i++) {
      if (this.play(channels[i])) {
        return true;
      }
    }
    return false;
  }

  play(channelIndex) {
    const channel = this._channels[channelIndex];
    if (channel) {
      if (channel.canPlay && (channel.audio.paused || channel.audio.ended)) {
        channel.audio.play();
        return true;
      }
    }
    return false;
  }
}

export default Audio;
