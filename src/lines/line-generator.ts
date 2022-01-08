import { Line, Outcome, OutcomeData } from '../svenska-spel/interfaces';

export function generateAllCombinations(event_number: number): Outcome[][] {
  if (event_number === 14) {
    return [[]];
  }
  const outcomes: Outcome[][] = [];
  const generated_combinations = generateAllCombinations(event_number + 1);
  for (const generated_line of generated_combinations) {
    outcomes.push([...generated_line, Outcome.HOME]);
    outcomes.push([...generated_line, Outcome.DRAW]);
    outcomes.push([...generated_line, Outcome.AWAY]);
  }
  return outcomes;
}

export function generateLine(outcome_data: Map<number, OutcomeData[]>, combination: Outcome[]): Line {
  try {
    const total_odds = combination.reduce((sum: number | undefined, outcome, index) => {
      const odds_percentage = outcome_data.get(index + 1)!.find((data) => data.outcome === outcome)!.odds_percentage;
      return sum === undefined ? undefined : sum * odds_percentage!;
    }, 1);

    const total_distribution = combination.reduce(
      (sum: number, outcome, index) =>
        sum * outcome_data.get(index + 1)!.find((data) => data.outcome === outcome)!.distribution_percentage,
      1,
    );
    const total_probability = combination.reduce(
      (sum: number, outcome, index) =>
        sum * outcome_data.get(index + 1)!.find((data) => data.outcome === outcome)!.probability_based_on_distribution,
      1,
    );
    return {
      outcomes: combination,
      total_odds,
      total_distribution,
      total_probability,
      bet_score: total_distribution + total_probability,
    };
  } catch (error) {
    console.error(`generate line failed`);
    throw error;
  }
}
