export interface BaseInput {
  script: ScriptName;
  game_type: GameType;
}

export enum GameType {
  EUROPATIPSET = 'europatipset',
  STRYKTIPSET = 'stryktipset',
}

export enum ScriptName {
  GENERATE_BETS = 'generate_bets',
  ANALYZE_FILTER = 'analyze_filter',
  FIND_DEADLINES = 'find_deadlines',
}
