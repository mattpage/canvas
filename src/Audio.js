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

  load(src, callback) {
    this._channels.push({
      audio: Audio.createElement(src, e => {
        const channelIndex = this._channels.findIndex(
          chan => chan.audio.src === src
        );
        if (channelIndex > -1) {
          const channel = this._channels[channelIndex];
          channel.canPlay = true;
          if (callback) {
            callback(channelIndex, channel, e);
          }
        }
      }),
      canPlay: false
    });
    return this._channels.length - 1;
  }

  pause(channelIndex) {
    const channel = this._channels[channelIndex];
    const canPlay = Boolean(channel && channel.canPlay);
    if (canPlay) {
      channel.audio.pause();
    }
    return canPlay;
  }

  play(channelIndex) {
    const channel = this._channels[channelIndex];
    const canPlay = Boolean(channel && channel.canPlay);
    if (canPlay) {
      channel.audio.play();
    }
    return canPlay;
  }
}

export default Audio;
