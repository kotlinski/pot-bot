import { generateAllCombinations, generateLine } from './line-generator';
import DrawAnalyzer from '../analyze/draw-analyzer';
import { ApiDraw } from '../svenska-spel/api-clients/interfaces/api-interfaces';
import { Line } from '../svenska-spel/interfaces';

export default class LinesProvider{
  private readonly draw_analyzer: DrawAnalyzer;
  constructor() {
    this.draw_analyzer = new DrawAnalyzer();
  }

  public getLines(draw: ApiDraw): Line[] {
    const outcome_data = this.draw_analyzer.massageOutcomeData(draw.events);
    console.log(`outcome_data.size: ${JSON.stringify(outcome_data.size, null, 2)}`);
    const all_combinations = generateAllCombinations(1);
    console.log(`all_combinations.length: ${JSON.stringify(all_combinations.length, null, 2)}`);
    return all_combinations.map((combination) => generateLine(outcome_data, combination))
  }
}
