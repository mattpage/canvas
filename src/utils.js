export const numberInRange = (min, max, res = 0.001) =>
  Math.random() * (max - min + res) + min;

export const integerInRange = (min, max) =>
  Math.floor(numberInRange(min, max, 1));
