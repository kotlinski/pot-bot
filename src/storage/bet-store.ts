import { outputFile, outputJSON, ensureDir } from 'fs-extra';
import { Line } from '../svenska-spel/interfaces';
import { GameType } from '../script/command-line-interfaces';
import { formatBet } from '../printers/print-helper';

export default class BetStore {
  constructor(private readonly game_type: GameType) {}

  public async storeBets(lines: Line[], draw_number: number): Promise<void> {
    for (const sub_folder of ['current', `old/${draw_number}`]) {
      const base_dir = `./draws/${this.game_type}/${sub_folder}`;
      await ensureDir(base_dir);
      await outputJSON(`${base_dir}/bets.json`, lines, { spaces: 2 });
      const bets = this.formatBets(lines);
      await outputFile(`${base_dir}/bets.txt`, bets);
    }
  }

  private formatBets(lines: Line[]) {
    return `${this.game_type}\n${lines.map(formatBet).join('\n')}`;
  }
}
