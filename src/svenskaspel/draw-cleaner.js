import math from './bet-calculations/math.js';
import drawBetValueRater from "./bet-calculations/draw-bet-value-rater.js";


function cleanEvents(events) {
  const events_with_data = events.map(event => {
    let odds_in_percentage = math.convertOddsToPercentage(event.odds);
    let distribution_in_percentage = math.convertDistributionToPercentage(event.distribution);
    return {
      number: event.eventNumber,
      description: event.description,
      odds: event.odds,
      outcome: event.outcome,
      odds_in_percentage: odds_in_percentage,
      distribution: distribution_in_percentage,
      odds_distribution_quota: math.calculateQuota(odds_in_percentage, distribution_in_percentage)
    }
  });
  const events_with_rates = drawBetValueRater.calculateRates(events_with_data);
  return events_with_rates.map(event => {
    return {
      number: event.eventNumber,
      description: event.description,
      bet_value_rate: event.bet_value_rate,
      odds_rate: event.odds_rate,
      odds_in_percentage: event.odds_in_percentage,
      outcome: event.outcome,
    }
  });

}

const api = {

  cleanDraw(draw) {
    return {
      turnover: parseInt(draw.turnover, 10),
      name: draw.drawComment,
      product: draw.productName,
      productId: draw.productId,
      drawNumber: draw.drawNumber,
      openTime: draw.openTime,
      closeTime: draw.closeTime,
      events: cleanEvents(draw.events)
    };
  },

};

export default api;
