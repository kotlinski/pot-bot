import optimist from 'optimist';
import { ScriptWrapper } from '../script-wrapper';
import DrawProvider from '../../svenska-spel/draw/draw-provider';
import LinesProvider from '../../lines/lines-provider';
import LineSorter from '../../lines/line-sorter';
import BetStore from '../../storage/bet-store';
// import { isTotalDistributionPlayable } from '../../filters/filters';
import { ScriptFactory } from '../script-factory';
import { BaseInput } from '../command-line-interfaces';
import { combinedFilters } from '../../filters/filters';

interface Input extends BaseInput {
  number_of_lines: string;
}

export default class GenerateBets implements ScriptWrapper {
  private readonly lines_provider: LinesProvider;
  private readonly lines_sorter: LineSorter;
  private readonly bet_store: BetStore;
  private readonly draw_provider: DrawProvider;
  private readonly input: Input;

  constructor() {
    this.input = optimist.demand(['number_of_lines']).argv as Input;
    this.draw_provider = ScriptFactory.createDrawProvider();
    this.lines_provider = new LinesProvider();
    this.lines_sorter = new LineSorter();
    this.bet_store = new BetStore(this.input.game_type);
  }

  async run(): Promise<void> {
    const number_of_lines = parseInt(this.input.number_of_lines, 10);

    const draw = await this.draw_provider.getDraw();
    const lines = this.lines_provider.getLines(draw);
    console.log(`lines before: ${JSON.stringify(lines.length, null, 2)}`);
    const filter_lines = lines.filter(combinedFilters);
    console.log(`lines after: ${JSON.stringify(filter_lines.length, null, 2)}`);
    const sorted_lines = this.lines_sorter.sortLines(filter_lines);

    console.log(`number_of_lines: ${JSON.stringify(number_of_lines, null, 2)}`);
    const final_lines = sorted_lines.slice(0, number_of_lines);
    await this.bet_store.storeBets(final_lines, draw.draw_number);
  }
}
