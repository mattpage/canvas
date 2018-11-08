import {
  createAvgFpsCalculator,
  CSS_COLOR_NAMES,
  integerInRange,
  numberInRange,
  randomColor
} from "../utils";

function isInteger(n) {
  return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

describe("utils", () => {
  describe("numberInRange", () => {
    it("should return a float within the range", () => {
      const f = numberInRange(0, 1);
      expect(isFloat(f));
    });
  });

  describe("integerInRange", () => {
    it("should return an integer within the range", () => {
      const n = integerInRange(0, 100);
      expect(isInteger(n));
    });
  });

  describe("randomColor", () => {
    it("should return a random color", () => {
      const color = randomColor();
      expect(CSS_COLOR_NAMES.includes(color));
    });
  });

  describe("createAvgFpsCalculator", () => {
    it("should return the avg for a series of calls", () => {
      let call = 1;
      window.performance.now = jest
        .spyOn(window.performance, "now")
        .mockImplementation(() => 1000 * call++);
      jest.useFakeTimers();
      let fpsCalculator;
      let elapsed = 0;
      let timerId = window.setInterval(() => {
        if (fpsCalculator) {
          fpsCalculator();
        } else {
          fpsCalculator = createAvgFpsCalculator();
        }
        elapsed += 1;
        if (elapsed > 2) {
          window.clearInterval(timerId);
          timerId = null;
        }
      }, 1000);
      jest.runAllTimers();
      const fps = fpsCalculator();
      expect(window.performance.now).toHaveBeenCalledTimes(4);
      expect(fps).toEqual(1);
    });
  });
});
