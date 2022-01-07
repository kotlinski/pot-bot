import { Line, Outcome } from '../svenska-spel/interfaces';

export function formatBet(line: Line) {
  return `E,${line.outcomes.map(outcomeToBet).join(',')}`;
}

export function outcomeToBet(outcome: Outcome): string {
  switch (outcome) {
    case Outcome.AWAY:
      return '2';
    case Outcome.DRAW:
      return 'X';
    case Outcome.HOME:
      return '1';
  }
}
