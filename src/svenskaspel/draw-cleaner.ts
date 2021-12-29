import {
  convertDistributionToPercentage,
  convertLottoRatesToOdds,
  convertToPercentage,
} from './bet-calculations/percentage-converter';
import { normalizeProperty } from './bet-calculations/event-property-normalizer';
import { SvenskaSpelDraw, SvenskaSpelEvent } from '../svenska-spel/api-clients/svenskaspel-interfaces';
import { Event, HomeAwayDraw, Outcome, CalculatedValues, Draw } from './interfaces';

function applyUniversityMath(event_distributions_in_percentage: HomeAwayDraw<number>, odds: HomeAwayDraw<number>) {
  // Math learned from university
  if (event_distributions_in_percentage.home < 0.07) {
    odds.home = 0;
  }
  if (event_distributions_in_percentage.home > 0.89) {
    odds.draw = 0;
    odds.away = 0;
  }
  if (event_distributions_in_percentage.draw < 0.06) {
    odds.draw = 0;
  }
  if (event_distributions_in_percentage.away > 0.81) {
    odds.home = 0;
    odds.draw = 0;
  }
  if (event_distributions_in_percentage.away < 0.06) {
    odds.away = 0;
  }
}

function cleanEvents(events: SvenskaSpelEvent[]): Event[] {
  return events.map((event: SvenskaSpelEvent) => {
    const odds = convertLottoRatesToOdds(event);
    const event_distributions_in_percentage: HomeAwayDraw<number> = convertDistributionToPercentage(event.distribution);
    const original_odds = { ...event.odds };
    applyUniversityMath(event_distributions_in_percentage, odds);

    const event_odds_in_percentage: HomeAwayDraw<number> = convertToPercentage(event.odds);

    const values = new Map<Outcome, CalculatedValues>();

    events = normalizeProperty(events, 'bet_value');

    for (const outcome of Object.values(Outcome)) {
      const calculated_details = calculateDetails(
        outcome,
        odds,
        original_odds,
        event_odds_in_percentage,
        event_distributions_in_percentage,
        odds_in_percentage_normalized,
      );
      values.set(outcome, calculated_details);
    }
    events = normalizeProperty(events, 'bet_value');
    events = normalizeProperty(events, 'odds_in_percentage');
    return {
      number: event.eventNumber,
      description: event.description,
      original_odds: { home: original_odds.home, draw: original_odds.draw, away: original_odds.away },
      odds,
      calculated_values: values,
    };
  });
}

function calculateDetails(
  outcome: Outcome,
  odds: HomeAwayDraw<number>,
  original_odds: HomeAwayDraw<string>,
  event_odds_in_percentage: HomeAwayDraw<number>,
  event_distributions_in_percentage: HomeAwayDraw<number>,
): CalculatedValues {
  const odds_in_percentage = event_odds_in_percentage[outcome];
  const distribution_in_percentage = event_distributions_in_percentage[outcome];
  return {
    odds: odds[outcome],
    original_odds: original_odds[outcome],
    odds_in_percentage,
    distribution_in_percentage,
    bet_value: Math.round((odds_in_percentage / distribution_in_percentage) * 10000) / 10000,
    odds_in_percentage_normalized: 0, // will be set later
    bet_value_normalized: 0, // will be set later
  };
}

export default class DrawCleaner {
  public massageData(draw: SvenskaSpelDraw): Draw {
    const events = cleanEvents(draw.events);

    return {
      turnover: parseInt(draw.turnover, 10),
      name: draw.drawComment,
      product: draw.productName,
      productId: draw.productId,
      drawNumber: draw.drawNumber,
      openTime: draw.openTime,
      closeTime: draw.closeTime,
      events,
    };
  }
}
