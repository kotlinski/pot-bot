import { HomeAwayDraw, Outcome, OutcomeData } from '../svenska-spel/interfaces';
import { ApiDrawEvent } from '../svenska-spel/api-clients/interfaces/api-interfaces';
import { convertFromOddsToPercentage, convertPlainValueToPercentage } from '../calculator/percentage-converter';
import UniversityMathApplier from '../calculator/university-math-applier';

export default class DrawAnalyzer {
  private readonly university_modifier: UniversityMathApplier;
  constructor() {
    this.university_modifier = new UniversityMathApplier();
  }

  public massageOutcomeData(events: ApiDrawEvent[]): Map<number, OutcomeData[]> {
    const event_odds_in_percentages = DrawAnalyzer.getOddsPercentages(events);
    const distribution_percentages = DrawAnalyzer.getDistributionPercentages(events);
    const newspaper_percentages = DrawAnalyzer.getNewspaperPercentages(events);

    const modeled_probability_in_percentage = this.university_modifier.calculateProbabilities([...distribution_percentages]);

    const event_data = new Map<number, OutcomeData[]>();
    for (const event of events) {
      const outcomes: OutcomeData[] = [];
      for (const outcome of Object.values(Outcome)) {
        const outcome_data: OutcomeData = {
          outcome,
          raw_odds: event.odds ? event.odds[outcome] : undefined,
          raw_distribution: event.distribution[outcome],
          odds_percentage: event_odds_in_percentages ? event_odds_in_percentages[event.event_number - 1][outcome] : undefined,
          distribution_percentage: distribution_percentages[event.event_number - 1][outcome],
          newspaper_percentage: newspaper_percentages ? newspaper_percentages[event.event_number - 1][outcome] : undefined,
          probability_based_on_distribution: modeled_probability_in_percentage[event.event_number - 1][outcome],
        };
        outcomes.push(outcome_data);
      }
      event_data.set(event.event_number, outcomes);
    }
    return event_data;
  }

  private static getOddsPercentages(events: ApiDrawEvent[]): HomeAwayDraw<number>[] | undefined {
    const event_odds = events.map((event) => event.odds);
    const odds: HomeAwayDraw<string>[] = event_odds.filter((raw_odds) => raw_odds) as HomeAwayDraw<string>[];
    if (odds.length !== 13) {
      return undefined; // at least one odds were missing
    }
    return odds.map(convertFromOddsToPercentage);
  }
  private static getDistributionPercentages(events: ApiDrawEvent[]): HomeAwayDraw<number>[] {
    const event_distributions = events.map((event) => event.distribution);
    return event_distributions.map(convertPlainValueToPercentage);
  }
  private static getNewspaperPercentages(events: ApiDrawEvent[]): HomeAwayDraw<number>[] | undefined {
    const event_newspaper_advices = events.map((event) => event.newspaper_advice);
    const advices: HomeAwayDraw<string>[] = event_newspaper_advices.filter((advice) => advice) as HomeAwayDraw<string>[];
    if (advices.length !== 13) {
      return undefined; // at least one odds were missing
    }
    return advices.map(convertPlainValueToPercentage);
  }
}
