import { Line } from '../svenska-spel/interfaces';
import { formatBet } from '../printers/print-helper';
import { GameType } from '../script/command-line-interfaces';
import moment from 'moment';

export function formatBets(game_type: GameType, lines: Line[]): string {
  return `${game_type}\n${lines.map(formatBet).join('\n')}`;
}
export const getFormattedToday = (): string => moment().format('YYYYMMDDTHHmm');
