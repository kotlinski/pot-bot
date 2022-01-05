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

export interface OutcomeData {
  outcome: Outcome;
  /*  normalized_odds: number;
    normalized_distribution: number;*/
  probability_based_on_distribution: number;
  odds_percentage: number;
  distribution_percentage: number;
  newspaper_percentage: number;
  raw_odds: string;
  raw_distribution: string;
}

export interface Line {
  outcomes: Outcome[];
  total_odds: number;
  total_distribution: number;
  total_probability: number;
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
