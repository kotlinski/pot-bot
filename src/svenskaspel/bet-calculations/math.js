
const oddsToPercentage = odds => 1 / parseInt(odds);

const api = {

  convertOddsToPercentage(odds) {
    const home_probability = oddsToPercentage(odds.home);
    const draw_probability = oddsToPercentage(odds.draw);
    const away_probability = oddsToPercentage(odds.away);
    const total_percentage = home_probability + draw_probability + away_probability;
    return {
      home: Math.round((home_probability / total_percentage) * 10000) / 10000,
      draw: Math.round((draw_probability / total_percentage) * 10000) / 10000,
      away: Math.round((away_probability / total_percentage) * 10000) / 10000,
    };
  },

  convertDistributionToPercentage(distribution) {
    return {
      home: parseInt(distribution.home) / 100,
      draw: parseInt(distribution.draw) / 100,
      away: parseInt(distribution.away) / 100,
    };
  },

  calculateQuota(odds_in_percentage, distribution_in_percentage) {
    return {
      home: Math.round((odds_in_percentage.home / distribution_in_percentage.home) * 10000) / 10000,
      draw: Math.round((odds_in_percentage.draw / distribution_in_percentage.draw) * 10000) / 10000,
      away: Math.round((odds_in_percentage.away / distribution_in_percentage.away) * 10000) / 10000,
    };
  }
};

export default api;
