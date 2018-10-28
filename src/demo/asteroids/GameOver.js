import Dialog from "./Dialog";

class GameOver extends Dialog {
  constructor(onNewGame = null) {
    super("#game-over");
    this.handleClick = this.handleClick.bind(this);
    this.element.addEventListener("click", this.handleClick);
    this._onNewGame = onNewGame;
  }

  get onNewGame() {
    return this._onNewGame;
  }

  set onNewGame(callback) {
    this._onNewGame = callback;
  }

  handleClick(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      if (event.target.id === "new-game") {
        if (this._onNewGame) {
          this._onNewGame(event);
        }
      }
    }
  }
}

export default GameOver;
