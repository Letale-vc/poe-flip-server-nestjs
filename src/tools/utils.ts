export const delay = (ms = 15000) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export function round(num: number, decimalPlaces = 0): number {
  const p = Math.pow(10, decimalPlaces);
  const n = num * p * (1 + Number.EPSILON);
  return Math.round(n) / p;
}
