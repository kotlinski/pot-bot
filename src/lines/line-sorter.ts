import { Line } from '../svenska-spel/interfaces';

export default class LineSorter {
  public sortLines(lines: Line[]): Line[] {
    const total_distribution_sort: Line[] = lines.sort(
      (line_a, line_b) => line_b.total_distribution - line_a.total_distribution,
    );
    console.log('total_distribution_sort: ');
    for (let i = 0; i < 200; i++) {
      console.log(
        `${i + 1}. ${total_distribution_sort[i].outcomes.toString()}, ${
          total_distribution_sort[i].total_distribution * Math.pow(3, 13)
        }`,
      );
    }

    const total_probability_sort: Line[] = lines.sort((line_a, line_b) => line_b.total_probability - line_a.total_probability);
    console.log('total_probability_sort');
    for (let i = 0; i < 200; i++) {
      console.log(
        `${i + 1}. ${total_probability_sort[i].outcomes.toString()}, ${
          total_probability_sort[i].total_probability * Math.pow(3, 13)
        }`,
      );
    }
    return total_probability_sort;
  }
}
