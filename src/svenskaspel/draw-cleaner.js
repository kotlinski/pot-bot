import {
  convertOddsToPercentage,
  convertDistributionToPercentage,
  convertOddsToFloatValues,
  convertLottoRatesToOdds
} from './bet-calculations/percentage-converter';
import {EVENT_OUTCOME_TYPES} from './event-outcome-types'
import {normalizeProperty} from "./bet-calculations/event-property-normalizer";



function cleanEvents(events) {
  return events.map(event => {
    event.odds = convertLottoRatesToOdds(event);
    event.odds = convertOddsToFloatValues(event.odds);
    let event_distributions_in_percentage = convertDistributionToPercentage(event.distribution);
    event.original_odds = event.odds;
    // Math learned from university
    if (event_distributions_in_percentage['home'] < 0.07) {
      event.odds['home'] = 0;
    }
    if (event_distributions_in_percentage['home'] > 0.89) {
      event.odds['draw'] = 0;
      event.odds['away'] = 0;
    }
    if (event_distributions_in_percentage['draw'] < 0.06) {
      event.odds['draw'] = 0;
    }
    if (event_distributions_in_percentage['away'] > 0.81) {
      event.odds['home'] = 0;
      event.odds['draw'] = 0;
    }
    if (event_distributions_in_percentage['away'] < 0.06) {
      event.odds['away'] = 0;
    }

    let event_odds_in_percentage = convertOddsToPercentage(event.odds);
    const cleanEvent = {
      number: event.eventNumber,
      description: event.description
    };
    EVENT_OUTCOME_TYPES.forEach(event_outcome_type => {
      const odds_in_percentage = event_odds_in_percentage[event_outcome_type];
      const distribution_in_percentage = event_distributions_in_percentage[event_outcome_type];
      cleanEvent[event_outcome_type] = {
        odds: event.odds[event_outcome_type],
        original_odds: event.original_odds[event_outcome_type],
        odds_in_percentage,
        distribution_in_percentage,
        bet_value: Math.round((odds_in_percentage / distribution_in_percentage) * 10000) / 10000,
      }
    });
    return cleanEvent;
  });
}

const api = {

  massageData(draw) {
    let events = cleanEvents(draw.events);
    events = normalizeProperty(events, 'bet_value');
    events = normalizeProperty(events, 'odds_in_percentage');

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
  },

};

export default api;
