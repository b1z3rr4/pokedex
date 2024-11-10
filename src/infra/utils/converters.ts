export function gramsToKilograms(grams: number) {
  const kilograms = grams / 10;
  return `${kilograms}kg`;
}

export function convertToMeters(value: number) {
  const result = value / 10;
  return `${result}m`;
}
