import { ensureDir, existsSync, outputJSON } from 'fs-extra';
import { SvenskaSpelResult } from '../../svenska-spel/api-clients/interfaces/svenskaspel-result-interfaces';
import { SvenskaSpelDraw } from '../../svenska-spel/api-clients/interfaces/svenskaspel-draw-interfaces';
import { GameType } from '../../script/command-line-interfaces';
import { getFormattedToday } from '../formatter';
import DrawHelper from '../../svenska-spel/draw/draw-helper';

export default class FileStoreHelper {
  constructor(readonly game_type: GameType, readonly draw_helper: DrawHelper) {}

  public async storeResultToBaseDirs(base_dirs: string[], result: SvenskaSpelResult): Promise<void> {
    for (const base_dir of base_dirs) {
      await ensureDir(base_dir);
      await outputJSON(`${base_dir}/result.json`, result, { spaces: 2 });
    }
  }

  public async storeToDrawHistory(draw: SvenskaSpelDraw): Promise<void> {
    const base_dir = `./draws/${this.game_type}/old/${draw.drawNumber}/draw-history`;
    await ensureDir(`${base_dir}`);
    await outputJSON(`${base_dir}/${getFormattedToday()}.json`, draw, { spaces: 2 });
  }

  public async storeDrawToBaseDirs(base_dirs: string[], draw: SvenskaSpelDraw): Promise<void> {
    for (const base_dir of base_dirs) {
      await ensureDir(base_dir);
      if (this.draw_helper.hasOdds(draw)) {
        await outputJSON(`${base_dir}/draw.json`, draw, { spaces: 2 });
      } else {
        await outputJSON(`${base_dir}/draw-without-odds.json`, draw, { spaces: 2 });
        if (!existsSync(`${base_dir}/draw.json`)) {
          await outputJSON(`${base_dir}/draw.json`, draw, { spaces: 2 });
        }
      }
      if (this.draw_helper.isBeforeCloseTime(draw)) {
        await outputJSON(`${base_dir}/draw-before-deadline.json`, draw, { spaces: 2 });
      }
    }
  }
}
