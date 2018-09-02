import { numberInRange, integerInRange } from "../utils";

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
});
