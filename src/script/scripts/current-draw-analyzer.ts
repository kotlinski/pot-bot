import optimist from 'optimist';
import { ScriptWrapper } from '../script-wrapper';
import { Input } from '../command-line-interfaces';
import DrawProvider from '../../svenska-spel/draw-provider';
import DrawAnalyzer from '../../analyze/draw-analyzer';

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
    this.draw_analyzer.massageOutcomeData(draw.events);
    // await generateLinesForDraw(number_of_lines);
  }
}
