export const KEYS = {
  A: "A".charCodeAt(0),
  B: "B".charCodeAt(0),
  C: "C".charCodeAt(0),
  D: "D".charCodeAt(0),
  E: "E".charCodeAt(0),
  F: "F".charCodeAt(0),
  G: "G".charCodeAt(0),
  H: "H".charCodeAt(0),
  I: "I".charCodeAt(0),
  J: "J".charCodeAt(0),
  K: "K".charCodeAt(0),
  L: "L".charCodeAt(0),
  M: "M".charCodeAt(0),
  N: "N".charCodeAt(0),
  O: "O".charCodeAt(0),
  P: "P".charCodeAt(0),
  Q: "Q".charCodeAt(0),
  S: "S".charCodeAt(0),
  T: "T".charCodeAt(0),
  U: "U".charCodeAt(0),
  V: "V".charCodeAt(0),
  W: "W".charCodeAt(0),
  Y: "Y".charCodeAt(0),
  Z: "Z".charCodeAt(0),
  ONE: "1".charCodeAt(0),
  TWO: "2".charCodeAt(0),
  THREE: "3".charCodeAt(0),
  FOUR: "4".charCodeAt(0),
  FIVE: "5".charCodeAt(0),
  SIX: "6".charCodeAt(0),
  SEVEN: "7".charCodeAt(0),
  EIGHT: "8".charCodeAt(0),
  NINE: "9".charCodeAt(0),
  ZERO: "0".charCodeAt(0),
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  ALT: 18,
  ARROW_DOWN: 40,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
  ARROW_UP: 38,
  BACKQUOTE: 192,
  BACKSLASH: 220,
  BACKSPACE: 8,
  BRACKET_LEFT: 219,
  BRACKET_RIGHT: 221,
  COMMA: 188,
  CONTROL: 17,
  DELETE: 46,
  END: 35,
  ENTER: 13,
  ESC: 27,
  HOME: 36,
  PAGEDOWN: 34,
  PAGEUP: 33,
  PERIOD: 190,
  QUOTE: 222,
  SEMICOLON: 186,
  SHIFT: 16,
  SLASH: 191,
  SPACEBAR: 32,
  TAB: 9
};

class Keyboard {
  static create() {
    return new Keyboard();
  }

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this._capturedKeys = {};
    this._lastKey = {};
    window.document.addEventListener("keydown", this.handleKeyDown);
    window.document.addEventListener("keyup", this.handleKeyUp);
  }

  captureKey(keyCode, callback) {
    this._capturedKeys[keyCode.toString()] = { callback };
  }

  captureKeys(keyCodes, callback) {
    keyCodes.forEach(keyCode => {
      this._capturedKeys[keyCode.toString()] = { callback };
    });
  }

  releaseKey(keyCode) {
    delete this._capturedKeys[keyCode.toString()];
  }

  releaseKeys(keyCodes) {
    keyCodes.forEach(keyCode => {
      delete this._capturedKeys[keyCode.toString()];
    });
  }

  isDown(keyCode) {
    return this._lastKey.keyCode === keyCode ? this._lastKey.isDown : false;
  }

  get lastKey() {
    return this._lastKey;
  }

  handleKey(event, isDown) {
    const keyCode = event.which;
    const { ctrlKey, shiftKey, altKey, metaKey, repeat } = event;
    this._lastKey = {
      keyCode,
      isDown,
      ctrlKey,
      shiftKey,
      altKey,
      metaKey,
      repeat
    };

    const key = keyCode.toString();
    if (key in this._capturedKeys) {
      event.preventDefault();
      const { callback } = this._capturedKeys[key];
      if (callback) {
        callback(this._lastKey, event);
      }
    }
  }

  handleKeyDown(event) {
    this.handleKey(event, true);
  }

  handleKeyUp(event) {
    this.handleKey(event, false);
  }
}

export default Keyboard;
