import { ScriptWrapper } from '../script-wrapper';

import { ScriptFactory } from '../script-factory';
import { appendFile, outputFile } from 'fs-extra';
import optimist from 'optimist';
import { BaseInput } from '../command-line-interfaces';
import * as os from 'os';
import pMap from 'p-map';
import { ApiResult, DrawProvider, Line, LinesProvider, ResultProvider, Storage } from '@pot-bot/core';

interface Input extends BaseInput {
  draw_number: string;
}

export default class AnalyzeFilter implements ScriptWrapper {
  private readonly report_file_path = `reports/filter/probability-filter.csv`;

  private readonly lines_provider: LinesProvider;
  private readonly draw_provider: DrawProvider;
  private readonly result_provider: ResultProvider;
  private readonly input: Input;

  constructor(storage: Storage) {
    this.input = optimist.demand(['draw_number']).argv as Input;
    const script_factory = new ScriptFactory();
    this.draw_provider = script_factory.createDrawProvider(storage);
    this.result_provider = script_factory.createResultProvider(storage);
    this.lines_provider = new LinesProvider();
  }

  async run(): Promise<void> {
    await outputFile(
      this.report_file_path,
      `draw_number|total_distribution|total_probability|total_odds|#winners|amount|${os.EOL}`,
    );

    const start_draw_number = parseInt(this.input.draw_number, 10);
    const draw_numbers: number[] = [];
    for (let draw_number = start_draw_number; draw_number > 0; draw_number--) {
      draw_numbers.push(draw_number);
    }
    await pMap(draw_numbers, async (draw_number: number) => this.asyncJob(draw_number), {
      concurrency: 4,
    });
  }

  private async asyncJob(draw_number: number): Promise<void> {
    console.log(`---`);
    console.log(`finding draw for ${draw_number}`);
    const result = await this.result_provider.getResult(draw_number);
    if (!result.cancelled) {
      try {
        const winners = result.distribution.find((dist) => dist.number_of_correct === 13)!.winners;
        const amount = result.distribution.find((dist) => dist.number_of_correct === 13)!.amount;
        const draw = await this.draw_provider.getDraw(draw_number);
        const lines = this.lines_provider.getLines(draw);
        // const filtered_lines: Line[] = lines.filter(isTotalOddsPlayable);
        // return line.total_odds * Math.pow(3, 13) > 1;
        const correct: Line = lines.filter((line: Line) => getNumberOfCorrectBets(line, result) === 13)[0];
        const tot_dist = correct.total_distribution * Math.pow(3, 13);
        const tot_prob = correct.total_probability * Math.pow(3, 13);
        const tot_odds = correct.total_odds ? correct.total_odds * Math.pow(3, 13) : '';
        const data = `${draw_number}|${tot_dist}|${tot_prob}|${tot_odds}|${winners}|${amount}${os.EOL}`;
        await appendFile(this.report_file_path, data);
      } catch (error) {
        console.error(`Probably missing odds and start odds for this draw`);
        if (error instanceof TypeError) {
          console.error(error.message);
        }
      }
    }
  }
}

function getNumberOfCorrectBets(line: Line, result: ApiResult): number {
  let number_of_correct = 0;
  for (let i = 0; i < line.outcomes.length; i++) {
    const event_result = result.events.find((event) => event.event_number === i + 1);
    if (line.outcomes[i] === event_result!.outcome) number_of_correct++;
  }
  return number_of_correct;
}
