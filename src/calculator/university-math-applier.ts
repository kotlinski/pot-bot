import { HomeAwayDraw } from '../svenskaspel/interfaces';
import UniversityMathCalculator from './university-math-calculator';

export default class UniversityMathApplier {
  /**
   * Math learned from university, report.pdf
   */
  public calculateProbabilities(distribution_in_percentages: HomeAwayDraw<number>[]): HomeAwayDraw<number>[] {
    return distribution_in_percentages.map(UniversityMathApplier.distributionsToProbabilities);
  }

  private static distributionsToProbabilities(distribution_in_percentage: HomeAwayDraw<number>): HomeAwayDraw<number> {
    const probability: HomeAwayDraw<number> = {
      home: UniversityMathCalculator.calculateHomeProbability(distribution_in_percentage.home),
      draw: UniversityMathCalculator.calculateDrawProbability(distribution_in_percentage.draw),
      away: UniversityMathCalculator.calculateAwayProbability(distribution_in_percentage.away),
    };
    const tot = probability.home + probability.draw + probability.away;
    return {
      home: probability.home / tot,
      draw: probability.draw / tot,
      away: probability.away / tot,
    };
  }
}
