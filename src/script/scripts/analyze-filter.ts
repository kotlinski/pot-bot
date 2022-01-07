import { ScriptWrapper } from '../script-wrapper';
import LinesProvider from '../../lines/lines-provider';
import { isTotalOddsPlayable } from '../../filters/filters';
import { ScriptFactory } from '../script-factory';
import DrawProvider from '../../svenska-spel/draw-provider';
import { BaseInput } from '../command-line-interfaces';
import optimist from 'optimist';

interface Input extends BaseInput {
  draw_number: string;
}

export default class AnalyzeFilter implements ScriptWrapper {
  private readonly lines_provider: LinesProvider;
  private readonly draw_provider: DrawProvider;
  private readonly results_provider: ResultsProvider;
  private readonly input: Input;

  constructor() {
    this.input = optimist.demand(['draw_number']).argv as Input;
    this.draw_provider = ScriptFactory.createDrawProvider();
    this.lines_provider = new LinesProvider();
  }

  async run(): Promise<void> {
    const draw_number = parseInt(this.input.draw_number, 10);
    const draw = await this.draw_provider.getDraw(draw_number);
    const result = await this.results_provider.getResults(draw_number);

    const lines = this.lines_provider.getLines(draw);
    console.log(`lines before: ${JSON.stringify(lines.length, null, 2)}`);
    const filter_lines = lines.filter(isTotalOddsPlayable);
    console.log(`lines before: ${JSON.stringify(filter_lines.length, null, 2)}`);
  }
}
