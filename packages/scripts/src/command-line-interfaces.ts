import { GameType } from '@pot-bot/core';

export interface BaseInput {
  script: ScriptName;
  game_type: GameType;
}

export enum ScriptName {
  GENERATE_BETS = 'generate_bets',
  ANALYZE_FILTER = 'analyze_filter',
  FIND_DEADLINES = 'find_deadlines',
}
