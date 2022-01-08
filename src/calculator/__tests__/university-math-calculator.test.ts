import UniversityMathCalculator from '../university-math-calculator';

describe('UniversityMathCalculator', () => {
  let distributions: number[];

  describe('calculateHomeProbability', () => {
    describe('below 7% distribution', () => {
      beforeEach(() => {
        distributions = [0.01, 0.06];
      });
      it('should have a probability of 0', () => {
        for (const distribution of distributions) {
          const probability = UniversityMathCalculator.calculateHomeProbability(distribution);
          expect(probability).toBeLessThan(distribution);
          expect(probability).toBe(0);
        }
      });
    });
    describe('with a distribution between 8% and 36%', () => {
      beforeEach(() => {
        distributions = [0.08, 0.36];
      });
      it('should have a probability higher than the distribution', () => {
        for (const distribution of distributions) {
          const probability = UniversityMathCalculator.calculateHomeProbability(distribution);
          expect(probability).toBeGreaterThan(distribution);
        }
      });
    });
    describe('with a distribution between 36% and 88%', () => {
      beforeEach(() => {
        distributions = [0.37, 0.88];
      });
      it('should have a probability lower than the distribution', () => {
        for (const distribution of distributions) {
          const probability = UniversityMathCalculator.calculateHomeProbability(distribution);
          expect(probability).toBeLessThan(distribution);
        }
      });
    });
    describe('with a distribution between 89% and 100%', () => {
      beforeEach(() => {
        distributions = [0.89, 1.0];
      });
      it('should have a probability of 100%', () => {
        for (const distribution of distributions) {
          const probability = UniversityMathCalculator.calculateHomeProbability(distribution);
          expect(probability).toBeGreaterThanOrEqual(distribution);
          expect(probability).toBe(1);
        }
      });
    });
  });
  describe('calculateDrawProbability', () => {
    describe('below 6% distribution', () => {
      beforeEach(() => {
        distributions = [0.01, 0.05];
      });
      it('should have a probability of 0', () => {
        for (const distribution of distributions) {
          const probability = UniversityMathCalculator.calculateDrawProbability(distribution);
          expect(probability).toBeLessThan(distribution);
          expect(probability).toBe(0);
        }
      });
    });
    describe('between 6% and 30% distribution', () => {
      beforeEach(() => {
        distributions = [0.07, 0.29];
      });
      it('should have higher probability than distribution', () => {
        for (const distribution of distributions) {
          const probability = UniversityMathCalculator.calculateDrawProbability(distribution);
          expect(probability).toBeGreaterThan(distribution);
        }
      });
    });
    describe('between 30% and 36% distribution', () => {
      beforeEach(() => {
        distributions = [0.31, 0.35];
      });
      it('should have lower probability than distribution', () => {
        for (const distribution of distributions) {
          const probability = UniversityMathCalculator.calculateDrawProbability(distribution);
          expect(probability).toBeLessThan(distribution);
        }
      });
    });
    describe('above 36% distribution', () => {
      beforeEach(() => {
        distributions = [0.37, 1];
      });
      it('should have an equal distribution and probability', () => {
        for (const distribution of distributions) {
          const probability = UniversityMathCalculator.calculateDrawProbability(distribution);
          expect(probability).toEqual(distribution);
        }
      });
    });
  });
  describe('calculateAwayProbability', () => {
    describe('below 3% distribution', () => {
      beforeEach(() => {
        distributions = [0.01, 0.02];
      });
      it('should have a probability of 0', () => {
        for (const distribution of distributions) {
          const probability = UniversityMathCalculator.calculateAwayProbability(distribution);
          expect(probability).toBeLessThan(distribution);
          expect(probability).toBe(0);
        }
      });
    });
    describe('between 3% and 29% distribution', () => {
      beforeEach(() => {
        distributions = [0.03, 0.29];
      });
      it('should have higher probability than distribution', () => {
        for (const distribution of distributions) {
          const probability = UniversityMathCalculator.calculateAwayProbability(distribution);
          expect(probability).toBeGreaterThan(distribution);
        }
      });
    });
    describe('between 29% and 76% distribution', () => {
      beforeEach(() => {
        distributions = [0.3, 0.75];
      });
      it('should have lower probability than distribution', () => {
        for (const distribution of distributions) {
          const probability = UniversityMathCalculator.calculateAwayProbability(distribution);
          expect(probability).toBeLessThan(distribution);
        }
      });
    });
    describe('between 76% and 80% distribution', () => {
      beforeEach(() => {
        distributions = [0.76, 0.8];
      });
      it('should have lower probability than distribution', () => {
        for (const distribution of distributions) {
          const probability = UniversityMathCalculator.calculateAwayProbability(distribution);
          expect(probability).toBeGreaterThanOrEqual(distribution);
        }
      });
    });
    describe('above 80% distribution', () => {
      beforeEach(() => {
        distributions = [0.81, 1];
      });
      it('should have an equal distribution and probability', () => {
        for (const distribution of distributions) {
          const probability = UniversityMathCalculator.calculateAwayProbability(distribution);
          expect(probability).toEqual(1);
        }
      });
    });
  });
});
