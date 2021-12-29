export interface Draw {
  turnover: number;
  name: string;
  product: string;
  productId: number;
  drawNumber: number;
  openTime: Date;
  closeTime: Date;
  events: Event[];
}
export interface Event {
  number: number;
  description: string;
  odds: HomeAwayDraw<number>;
  original_odds: HomeAwayDraw<string>;
  calculated_values: Map<Outcome, CalculatedValues>;
}
export interface CalculatedValues {
  odds: number;
  original_odds: string;
  odds_in_percentage: number;
  odds_in_percentage_normalized: number;
  distribution_in_percentage: number;
  bet_value: number;
  bet_value_normalized: number;
}

export interface HomeAwayDraw<T> {
  home: T;
  draw: T;
  away: T;
}

export enum Outcome {
  HOME = 'home',
  DRAW = 'draw',
  AWAY = 'away',
}

export interface Line {
  outcomes: Outcome[];
  total_odds: number;
  total_bet_rate: number;
  bet_score: number;
}

export interface Bet {
  total_odds: number;
  outcomes: Outcome[];
}
export interface BetIndexSign {
  index: number;
  sign: Outcome;
  rate: number;
}
