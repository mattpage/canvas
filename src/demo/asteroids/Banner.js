import DisplayElement from "./DisplayElement";

class Banner extends DisplayElement {
  constructor() {
    super("#banner");
    this.titleElement = this.element.querySelector("h2");
  }

  show(title, timeoutMs = 2000) {
    this.titleElement.textContent = title;
    super.show(timeoutMs);
  }
}

export default Banner;
