import { Line } from '../svenska-spel/interfaces';

export default class LineSorter {
  public sortLines(lines: Line[]): Line[] {
    const total_odds_sort: Line[] = lines.sort((line_a, line_b) => line_b.total_odds - line_a.total_odds);
    console.log('total_odds_sort');
    for (let i = 0; i < 10; i++) {
      console.log(`${i}. ${total_odds_sort[i].outcomes.toString()}, ${total_odds_sort[i].total_odds}`);
    }

    const total_distribution_sort: Line[] = lines.sort(
      (line_a, line_b) => line_b.total_distribution - line_a.total_distribution,
    );
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
    return bet_score_sort;
  }
}
