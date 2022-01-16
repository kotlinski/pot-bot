import { generateAllCombinations, generateLine } from './line-generator';
import DrawAnalyzer from '../analyze/draw-analyzer';
import { ApiDraw } from '../svenska-spel/api-clients/interfaces/api-interfaces';
import { Line, Outcome } from '../svenska-spel/interfaces';

export default class LinesProvider {
  private readonly draw_analyzer: DrawAnalyzer;
  private readonly all_combinations: Outcome[][];
  constructor() {
    this.draw_analyzer = new DrawAnalyzer();
    this.all_combinations = generateAllCombinations(1);
  }

  public getLines(draw: ApiDraw): Line[] {
    try {
      const outcome_data = this.draw_analyzer.massageOutcomeData(draw.events);
      return this.all_combinations.map((combination) => generateLine(outcome_data, combination));
    } catch (error) {
      console.error('get lines failed');
      throw error;
    }
  }
}
