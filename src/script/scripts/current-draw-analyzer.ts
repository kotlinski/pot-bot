import optimist from 'optimist';
import { ScriptWrapper } from '../script-wrapper';
import { Input } from '../command-line-interfaces';
import DrawProvider from '../../svenska-spel/draw-provider';
import DrawAnalyzer from '../../analyze/draw-analyzer';
import { Line, Outcome, OutcomeData } from '../../svenskaspel/interfaces';

export default class CurrentDrawAnalyzer implements ScriptWrapper {
  private readonly draw_analyzer: DrawAnalyzer;
  constructor(private readonly draw_provider: DrawProvider) {
    this.draw_analyzer = new DrawAnalyzer();
  }
  parseInput(): Input {
    const input = optimist.demand(['number_of_lines']).argv as Input;
    if (!input.number_of_lines) {
      throw new Error('How many lines do you want to bet? add param: number_of_lines');
    }
    return input;
  }

  async run(_input: Input): Promise<void> {
    // const number_of_lines = parseInt(input.number_of_lines, 10)
    const draw = await this.draw_provider.getCurrentDraw();
    const outcome_data = this.draw_analyzer.massageOutcomeData(draw.events);
    console.log(`outcome_data.size: ${JSON.stringify(outcome_data.size, null, 2)}`);
    const all_combinations = this.generateAllCombinations(1);
    console.log(`all_combinations.length: ${JSON.stringify(all_combinations.length, null, 2)}`);

    const lines = all_combinations.map((combination) => this.generateLine(outcome_data, combination))

    const total_odds_sort: Line[] = lines.sort((line_a, line_b) => line_b.total_odds -line_a.total_odds);
    console.log('total_odds_sort');
    for (let i = 0; i < 10; i++) {
      console.log(`${i}. ${total_odds_sort[i].outcomes.toString()}, ${total_odds_sort[i].total_odds}`);
    }

    const total_distribution_sort: Line[] = lines.sort((line_a, line_b) => line_b.total_distribution - line_a.total_distribution);
    console.log('total_distribution_sort: ');
    for (let i = 0; i < 10; i++) {
      console.log(`${i}. ${total_distribution_sort[i].outcomes.toString()}, ${total_distribution_sort[i].total_distribution}`);
    }

    const total_probability_sort: Line[] = lines.sort((line_a, line_b) => line_b.total_probability - line_a.total_probability);
    console.log('total_probability_sort');
    for (let i = 0; i < 10; i++) {
      console.log(`${i}. ${total_probability_sort[i].outcomes.toString()}, ${total_probability_sort[i].total_probability}`);
    }
    const bet_score_sort: Line[] = lines.sort((line_a, line_b) => line_b.bet_score - line_a.bet_score);
    console.log('bet_score_sort');
    for (let i = 0; i < 10; i++) {
      console.log(`${i}. ${bet_score_sort[i].outcomes.toString()}, ${bet_score_sort[i].bet_score}`);
    }
    // await generateLinesForDraw(number_of_lines);
  }

  private generateAllCombinations(event_number: number): Outcome[][] {
    if (event_number === 14) {
      return [[]];
    }
    const outcomes: Outcome[][] = [];
    const generated_combinations = this.generateAllCombinations(event_number + 1);
    for (const generated_line of generated_combinations) {
      outcomes.push([...generated_line, Outcome.HOME]);
      outcomes.push([...generated_line, Outcome.DRAW]);
      outcomes.push([...generated_line, Outcome.AWAY]);
    }
    return outcomes;
  }
  private generateLine(outcome_data: Map<number, OutcomeData[]>, combination: Outcome[]): Line {
    const total_odds = combination.reduce(
      (sum: number, outcome, index) =>
        sum * outcome_data.get(index + 1)!.find((data) => data.outcome === outcome)!.odds_percentage,
      1,
    );
    const total_distribution = combination.reduce(
      (sum: number, outcome, index) =>
        sum * outcome_data.get(index + 1)!.find((data) => data.outcome === outcome)!.distribution_percentage,
      1,
    );
    const total_probability = combination.reduce(
      (sum: number, outcome, index) =>sum * outcome_data.get(index + 1)!.find((data) => data.outcome === outcome)!.probability_based_on_distribution,
      1,
    );
    return {
      outcomes: combination,
      total_odds,
      total_distribution,
      total_probability,
      bet_score: total_odds+total_distribution+total_probability,
    };
  }
}
