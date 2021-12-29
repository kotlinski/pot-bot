import { HomeAwayDraw, Outcome } from '../svenskaspel/interfaces';
import { ApiEvent } from '../svenska-spel/api-clients/api-interfaces';
import { convertToPercentage } from '../svenskaspel/bet-calculations/percentage-converter';
import UniversityMathApplier from '../calculator/university-math-applier';

interface OutcomeData {
  event_number: number;
  outcome: Outcome;
/*  normalized_odds: number;
  normalized_distribution: number;*/
  probability: number;
  odds_percentage: number;
  distribution_percentage: number;
  newspaper_percentage: number;
  raw_odds: string;
  raw_distribution: string;
}

export default class DrawAnalyzer {
  private readonly university_modifier: UniversityMathApplier;
  constructor() {
    this.university_modifier = new UniversityMathApplier();
  }

  public massageOutcomeData(events: ApiEvent[]): OutcomeData[] {
    const event_odds_in_percentages = this.getOddsPercentages(events);
    const distribution_percentages = this.getDistributionPercentages(events);
    const newspaper_percentages = this.getNewspaperPercentages(events);

    const modeled_probability_in_percentage = this.university_modifier.calculateProbabilities(event_odds_in_percentages);

    const outcomes: OutcomeData[] = [];
    for (const event of events) {
      for (const outcome of Object.values(Outcome)) {
        const outcome_data: OutcomeData = {
          event_number: event.event_number,
          outcome,
          raw_odds: event.odds[outcome],
          raw_distribution: event.distribution[outcome],
          odds_percentage: event_odds_in_percentages[event.event_number - 1][outcome],
          distribution_percentage: distribution_percentages[event.event_number - 1][outcome],
          newspaper_percentage: newspaper_percentages[event.event_number - 1][outcome],
          probability: modeled_probability_in_percentage[event.event_number-1][outcome],
        };
        outcomes.push(outcome_data);
      }
    }
    return outcomes;
  }

  private getOddsPercentages(events: ApiEvent[]): HomeAwayDraw<number>[] {
    return this.mapEvents(events, 'odds', convertToPercentage);
  }
  private getDistributionPercentages(events: ApiEvent[]): HomeAwayDraw<number>[] {
    return this.mapEvents(events, 'distribution', convertToPercentage);
  }
  private getNewspaperPercentages(events: ApiEvent[]): HomeAwayDraw<number>[] {
    return this.mapEvents(events, 'newspaper_advice', convertToPercentage);
  }
  private mapEvents(
    events: ApiEvent[],
    key: 'odds' | 'distribution' | 'newspaper_advice',
    formatter: (key: HomeAwayDraw<string>) => HomeAwayDraw<number>,
  ): HomeAwayDraw<number>[] {
    return events.map((event) => formatter(event[key]));
  }
}
