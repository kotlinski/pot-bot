function calculateOddsRateOnCleanData(events) {
  let lowest = 1;
  events.forEach(event => {
    lowest = Math.min(lowest, event.odds_in_percentage.home);
    lowest = Math.min(lowest, event.odds_in_percentage.draw);
    lowest = Math.min(lowest, event.odds_in_percentage.away);
  });

  events = events.map(event => {
    event.odds_rate = {
      home: event.odds_in_percentage.home - lowest,
      draw: event.odds_in_percentage.draw - lowest,
      away: event.odds_in_percentage.away - lowest,
    };
    return event;
  });
  let highest = 0;
  events.forEach(event => {
    highest = Math.max(highest, event.odds_rate.home);
    highest = Math.max(highest, event.odds_rate.draw);
    highest = Math.max(highest, event.odds_rate.away);
  });

  events = events.map(event => {
    event.odds_rate = {
      home: Math.round((event.odds_rate.home / highest) * 10000) / 10000,
      draw: Math.round((event.odds_rate.draw / highest) * 10000) / 10000,
      away: Math.round((event.odds_rate.away / highest) * 10000) / 10000,
    };
    return event;
  });

  return events;
}

function calculateBetValueRateOnCleanData(events) {
  let lowest_odds_distribution_quota = 1;
  events.forEach(event => {
    lowest_odds_distribution_quota = Math.min(lowest_odds_distribution_quota, event.odds_distribution_quota.home);
    lowest_odds_distribution_quota = Math.min(lowest_odds_distribution_quota, event.odds_distribution_quota.draw);
    lowest_odds_distribution_quota = Math.min(lowest_odds_distribution_quota, event.odds_distribution_quota.away);
  });

  events = events.map(event => {
    event.bet_value_rate = {
      home: event.odds_distribution_quota.home - lowest_odds_distribution_quota,
      draw: event.odds_distribution_quota.draw - lowest_odds_distribution_quota,
      away: event.odds_distribution_quota.away - lowest_odds_distribution_quota,
    };
    return event;
  });
  let highest_odds_distribution_quota = 0;
  events.forEach(event => {
    highest_odds_distribution_quota = Math.max(highest_odds_distribution_quota, event.bet_value_rate.home);
    highest_odds_distribution_quota = Math.max(highest_odds_distribution_quota, event.bet_value_rate.draw);
    highest_odds_distribution_quota = Math.max(highest_odds_distribution_quota, event.bet_value_rate.away);
  });

  events = events.map(event => {
    event.bet_value_rate = {
      home: Math.round((event.bet_value_rate.home / highest_odds_distribution_quota) * 10000) / 10000,
      draw: Math.round((event.bet_value_rate.draw / highest_odds_distribution_quota) * 10000) / 10000,
      away: Math.round((event.bet_value_rate.away / highest_odds_distribution_quota) * 10000) / 10000,
    };
    return event;
  });

  return events;
}

const api = {
  calculateRates(events) {
    let cleanDrawWithRates = calculateBetValueRateOnCleanData(events);
    cleanDrawWithRates = calculateOddsRateOnCleanData(cleanDrawWithRates);
    return cleanDrawWithRates;
  }
};

export default api;
