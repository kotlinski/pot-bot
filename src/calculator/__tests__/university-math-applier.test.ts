import UniversityMathApplier from '../university-math-applier';
import { HomeAwayDraw } from '../../svenskaspel/interfaces';

describe('university-math-applier.test.ts', function () {
  let applier: UniversityMathApplier;
  let distribution_percentages: HomeAwayDraw<number>[];

  beforeEach(() => {
    applier = new UniversityMathApplier();
  });
  describe('calculateProbabilities', () => {
    beforeEach(() => {
      distribution_percentages = [
        {
          home: 0.9,
          draw: 0.5,
          away: 0.5,
        },
        {
          home: 0.01,
          draw: 0.90,
          away: 0.90,
        },
        {
          home: 0.23,
          draw: 0.20,
          away: 0.05,
        },
      ];
    });
    it('should always normalize results', () => {
      const probabilities = applier.calculateProbabilities(distribution_percentages);
      for (const probability of probabilities) {
        const sum = probability.away+probability.draw+probability.home;
        expect(sum).toBe(1);
      }
    });
  });
});
