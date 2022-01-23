import { HomeAwayDraw, Outcome } from '../svenska-spel/interfaces';

export const oddsToPercentage = (odds: number): number => {
  if (odds === 0) {
    return 0;
  }
  return 1 / odds;
};

export const voidConverter = (odds: number): number => odds;

export function convertFromOddsToPercentage(raw_odds: HomeAwayDraw<string>): HomeAwayDraw<number> {
  return convertToPercentage(raw_odds, oddsToPercentage);
}
export function convertPlainValueToPercentage(raw_odds: HomeAwayDraw<string>): HomeAwayDraw<number> {
  return convertToPercentage(raw_odds, voidConverter);
}

export function convertToPercentage(
  raw_data: HomeAwayDraw<string>,
  converter: (value: number) => number,
): HomeAwayDraw<number> {
  const odds: HomeAwayDraw<number> = convertOddsToFloatValues(raw_data);
  const total_percentage = Object.values(Outcome).reduce(
    (percentage_sum: number, outcome: Outcome) => percentage_sum + converter(odds[outcome]),
    0,
  );
  return {
    home: Math.round((converter(odds[Outcome.HOME]) / total_percentage) * 10000) / 10000,
    draw: Math.round((converter(odds[Outcome.DRAW]) / total_percentage) * 10000) / 10000,
    away: Math.round((converter(odds[Outcome.AWAY]) / total_percentage) * 10000) / 10000,
  };
}

export function convertOddsToFloatValues(odds: HomeAwayDraw<string>): HomeAwayDraw<number> {
  return {
    home: parseFloat(odds.home.replace(',', '.')),
    draw: parseFloat(odds.draw.replace(',', '.')),
    away: parseFloat(odds.away.replace(',', '.')),
  };
}
/*
export function convertOddsToIntegerPercentage(odds: any) {
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
export function convertOddsToRawNumbers(odds: any) {
  const home_probability = oddsToPercentage(odds.home);
  const draw_probability = oddsToPercentage(odds.draw);
  const away_probability = oddsToPercentage(odds.away);
  const total_percentage = home_probability + draw_probability + away_probability;

  return {
    home: home_probability / total_percentage,
    draw: draw_probability / total_percentage,
    away: away_probability / total_percentage,
  };
}

function convertPercentageToOdds(fraction: number) {
  return 1 / fraction;
}

export function convertLottoRatesToOdds(event: SvenskaSpelEvent): HomeAwayDraw<number> {
  if (
    event.eventTypeDescription === '' ||
    event.eventTypeDescription === undefined ||
    event.eventTypeDescription === 'Neutral plan' ||
    event.eventTypeDescription === 'Neutral Plan'
  ) {
    return convertOddsToFloatValues(event.odds);
  } else {
    // game is cancelled
    const cancelled_game_odds = event.eventTypeDescription.match(/\d+/g)!.map((number: any) => parseInt(number, 10));
    const total = cancelled_game_odds.reduce((a: number, b: number) => a + b);
    const home = convertPercentageToOdds(cancelled_game_odds[0] / total);
    const draw = convertPercentageToOdds(cancelled_game_odds[1] / total);
    const away = convertPercentageToOdds(cancelled_game_odds[2] / total);
    return {
      home,
      draw,
      away,
    };
  }
}*/

/*
export function convertDistributionToPercentage(distribution: HomeAwayDraw<string>): HomeAwayDraw<number> {
  return {
    home: parseInt(distribution.home, 10) / 100,
    draw: parseInt(distribution.draw, 10) / 100,
    away: parseInt(distribution.away, 10) / 100,
  };
}
*/
