import optimist from 'optimist';
import { ScriptWrapper } from '../script-wrapper';
import DrawProvider from '../../svenska-spel/draw/draw-provider';
import LinesProvider from '../../lines/lines-provider';
import LineSorter from '../../lines/line-sorter';
// import { isTotalDistributionPlayable } from '../../filters/filters';
import { ScriptFactory } from '../script-factory';
import { BaseInput } from '../command-line-interfaces';
import { combinedFilters } from '../../filters/filters';
import FileStore from '../../storage/file-store/file-store';
import { Storage } from '../../storage/storage';

interface Input extends BaseInput {
  number_of_lines: string;
}

export default class GenerateBets implements ScriptWrapper {
  private readonly lines_provider: LinesProvider;
  private readonly lines_sorter: LineSorter;
  private readonly draw_provider: DrawProvider;
  private readonly input: Input;
  private readonly bet_store: Storage;

  constructor(storage: Storage) {
    this.input = optimist.demand(['number_of_lines']).argv as Input;
    const script_factory = new ScriptFactory();
    this.draw_provider = script_factory.createDrawProvider(storage);
    this.lines_provider = new LinesProvider();
    this.lines_sorter = new LineSorter();
    this.bet_store = new FileStore(this.input.game_type);
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
