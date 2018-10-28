import Dialog from "./Dialog";

class Banner extends Dialog {
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
