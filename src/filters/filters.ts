import { Line } from '../svenska-spel/interfaces';

export function isTotalOddsPlayable(line: Line): boolean {
  return line.total_odds * Math.pow(3, 13) > 1;
}
