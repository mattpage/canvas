class Mouse {

  constructor() {
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
    window.addEventListener("mousemove", this.handleMouseMove);
  }

  get position() {
    return {
      x: this.mouse.x,
      y: this.mouse.y
    };
  }

  handleMouseMove(event) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }
}

export default Mouse;
