export const numberInRange = (min, max) =>
  Math.random() * (max - min + 1) + min;

export const integerInRange = (min, max) => Math.floor(numberInRange(min, max));
