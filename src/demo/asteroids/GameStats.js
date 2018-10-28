import DisplayElement from "./DisplayElement";

class GameStats extends DisplayElement {
  constructor() {
    super("#stats");
    this.shipsElement = this.element.querySelector("#ships");
    this.asteroidsElement = this.element.querySelector("#asteroids");
    this.bulletsElement = this.element.querySelector("#bullets");
    this.debrisElement = this.element.querySelector("#debris");
    this.fpsElement = this.element.querySelector("#fps");
  }

  update(stats) {
    const ships = stats.players + stats.enemies;
    this.shipsElement.textContent = ships;
    this.asteroidsElement.textContent = stats.asteroids;
    this.bulletsElement.textContent = stats.bullets;
    this.debrisElement.textContent = stats.debris;
    this.fpsElement.textContent = stats.fps;
  }
}

export default GameStats;
