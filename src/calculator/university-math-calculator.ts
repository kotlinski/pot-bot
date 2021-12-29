export default class UniversityMathCalculator {
  public static calculateHomeProbability(distribution: number): number {
    if (distribution < 0.08) {
      return 0;
    } else if (distribution >= 0.08 && distribution < 0.66) {
      return 0.652 * distribution + 0.12783;
    } else if (distribution >= 0.66 && distribution < 0.74) {
      return 0.55179;
    } else if (distribution >= 0.74 && distribution <= 0.88) {
      return 1.765 * distribution - 0.73694;
    }
    return 1;
  }

  /**
   * According to this model, distributions between 7 and 30 are good.
   *
   * @param distribution
   */
  public static calculateDrawProbability(distribution: number): number {
    if (distribution < 0.07) {
      return 0;
    } else if (distribution >= 0.07 && distribution <= 0.36) {
      return -2.7049 * distribution * distribution + 1.766 * distribution + 0.01521;
    } else {
      return distribution;
    }
  }

  /**
   * According to this model distribution levels between 7-29, and 76 - 100 are the best.
   * @param distribution
   */
  public static calculateAwayProbability(distribution: number): number {
    if (distribution < 0.07) {
      return 0;
    } else if (distribution >= 0.07 && distribution < 0.63) {
      return 0.6 * distribution + 0.11837;
    } else if (distribution >= 0.63 && distribution <= 0.8) {
      return 2.1 * distribution - 0.82737;
    } else {
      return 1;
    }
  }
}
