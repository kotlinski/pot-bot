import { Line } from '../svenska-spel/interfaces';
import { formatBet } from '../printers/print-helper';
import dayjs from 'dayjs';
import { GameType } from '../interfaces';

export function formatBets(game_type: GameType, lines: Line[]): string {
  return `${game_type}\n${lines.map(formatBet).join('\n')}`;
}
export const getFormattedToday = (): string => dayjs().format('YYYYMMDDTHHmm');
