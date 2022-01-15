import { Line } from '../svenska-spel/interfaces';

export function combinedFilters(line: Line): boolean {
  return isProbabilityPlayable(line) && isDistributionPlayable(line);
}
export function isProbabilityPlayable(line: Line): boolean {
  return line.total_probability * Math.pow(3, 13) > 0.5;
}

export function isDistributionPlayable(line: Line): boolean {
  const distribution_value = line.total_distribution * Math.pow(3, 13);
  return 0.69 < distribution_value && distribution_value < 90;
}
