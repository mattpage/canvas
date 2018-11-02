import DisplayElement from "./DisplayElement";

class GameStats extends DisplayElement {
  constructor() {
    super("#stats");
    this.scoreElement = this.element.querySelector("#score");
    this.livesElement = this.element.querySelector("#lives");
    this.levelElement = this.element.querySelector("#level");
    this.shipsElement = this.element.querySelector("#ships");
    this.asteroidsElement = this.element.querySelector("#asteroids");
    this.bulletsElement = this.element.querySelector("#bullets");
    this.debrisElement = this.element.querySelector("#debris");
    this.fpsElement = this.element.querySelector("#fps");
    this.renderElement = this.element.querySelector("#render");
  }

  update(stats) {
    this.scoreElement.textContent = stats.score;
    this.livesElement.textContent = stats.lives;
    this.levelElement.textContent = stats.level;
    const ships = stats.players + stats.enemies;
    this.shipsElement.textContent = ships;
    this.asteroidsElement.textContent = stats.asteroids;
    this.bulletsElement.textContent = stats.bullets;
    this.debrisElement.textContent = stats.debris;
    this.fpsElement.textContent = stats.fps;
    this.renderElement.textContent = stats.render;
  }
}

export default GameStats;
