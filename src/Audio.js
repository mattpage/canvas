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
      audio.volume = volume || 0.5;
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
    this.handleCanPlay = this.handleCanPlay.bind(this);
  }

  load(source) {
    this._channels.push({
      source,
      audio: Audio.createElement(source, e => this.handleCanPlay(source, e)),
      canPlay: false
    });
    return this._channels.length - 1;
  }

  handleCanPlay(source, e) {
    console.log("canPlay", source, e);
    const channel = this._channels.find(chan => chan.source === source);
    if (channel) {
      channel.canPlay = true;
    }
  }

  pause(channelIndex) {
    const channel = this._channels[channelIndex];
    if (channel) {
      channel.audio.pause();
    }
  }

  play(channelIndex) {
    const channel = this._channels[channelIndex];
    if (channel) {
      if (!channel.canPlay) {
        throw new Error("Channel cannot play");
      }
      channel.audio.play();
    }
  }
}

export default Audio;
