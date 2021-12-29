export interface Input {
  number_of_lines: string;
}

export enum GameType {
  EUROPATIPSET = 'europatipset',
  STRYKTIPSET = 'stryktipset',
}

export enum ScriptName {
  ANALYZE_CURRENT_DRAW = 'analyze_current_draw',
}

export interface ScriptArg {
  script: ScriptName;
  game_type: GameType;
  api_key: string;
}
