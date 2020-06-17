const oddsToPercentage = odds => {
  let odds_as_number = parseFloat(odds);
  if (odds_as_number === 0) {
    return 0;
  }
  return 1 / odds_as_number;
};

export function convertOddsToPercentage(odds) {
  const home_probability = oddsToPercentage(odds.home);
  const draw_probability = oddsToPercentage(odds.draw);
  const away_probability = oddsToPercentage(odds.away);
  const total_percentage = home_probability + draw_probability + away_probability;

  return {
    home: Math.round((home_probability / total_percentage) * 10000) / 10000,
    draw: Math.round((draw_probability / total_percentage) * 10000) / 10000,
    away: Math.round((away_probability / total_percentage) * 10000) / 10000,
  };
}

export function convertOddsToIntegerPercentage(odds) {
  const home_probability = oddsToPercentage(odds.home);
  const draw_probability = oddsToPercentage(odds.draw);
  const away_probability = oddsToPercentage(odds.away);
  const total_percentage = home_probability + draw_probability + away_probability;

  return {
    home: Math.round((home_probability / total_percentage) * 100),
    draw: Math.round((draw_probability / total_percentage) * 100),
    away: Math.round((away_probability / total_percentage) * 100),
  };
}

function convertPercentageToOdds(fraction) {
  return (1 / fraction);
}

export function convertLottoRatesToOdds(event) {
  if (event.eventTypeDescription === "" || event.eventTypeDescription === undefined || event.eventTypeDescription === 'Neutral plan' || event.eventTypeDescription === 'Neutral Plan') {
    return event.odds;
  } else {
    const odds = event.eventTypeDescription.match(/\d+/g).map(number => parseInt(number));
    const total = odds.reduce((a, b) => a + b);
    let home = `${convertPercentageToOdds(odds[0] / total)}`;
    let draw = `${convertPercentageToOdds(odds[1] / total)}`;
    let away = `${convertPercentageToOdds(odds[2] / total)}`;
    return {
      home,
      draw,
      away,
    };
  }
}

export function convertOddsToFloatValues(odds) {
  return {
    home: parseFloat(odds.home.replace(',', '.')),
    draw: parseFloat(odds.draw.replace(',', '.')),
    away: parseFloat(odds.away.replace(',', '.')),
  };
}

export function convertDistributionToPercentage(distribution) {
  return {
    home: parseInt(distribution.home) / 100,
    draw: parseInt(distribution.draw) / 100,
    away: parseInt(distribution.away) / 100,
  };
}
