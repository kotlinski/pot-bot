import { ensureDir, existsSync, outputJSON } from 'fs-extra';
import moment from 'moment';
import DrawHelper from '../svenska-spel/draw/draw-helper';
import { GameType } from '../script/command-line-interfaces';
import loadJsonFile from 'load-json-file';
import { SvenskaSpelDraw } from '../svenska-spel/api-clients/interfaces/svenskaspel-draw-interfaces';

export default class DrawStore {
  private readonly draw_helper: DrawHelper;

  constructor(private readonly game_type: GameType) {
    this.draw_helper = new DrawHelper();
  }

  public async storeDraw(draw: SvenskaSpelDraw): Promise<void> {
    const base_dirs = [`./draws/${this.game_type}/old/${draw.drawNumber}`];
    if (this.draw_helper.isCurrentDraw(draw)) {
      base_dirs.push(`./draws/${this.game_type}/current`);
    }
    await this.storeDrawToBaseDirs(base_dirs, draw);
    await this.storeToDrawHistory(draw);
  }
  private async storeDrawToBaseDirs(base_dirs: string[], draw: SvenskaSpelDraw): Promise<void> {
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
  private async storeToDrawHistory(draw: SvenskaSpelDraw): Promise<void> {
    const base_dir = `./draws/${this.game_type}/old/${draw.drawNumber}/draw-history`;
    await ensureDir(`${base_dir}`);
    await outputJSON(`${base_dir}/${this.getFormattedToday()}.json`, draw, { spaces: 2 });
  }
  private readonly getFormattedToday = (): string => moment().format('YYYYMMDDTHHmm');

  public async getDraw(draw_number?: number): Promise<SvenskaSpelDraw | undefined> {
    try {
      if (draw_number) {
        return await loadJsonFile<SvenskaSpelDraw>(`./draws/${this.game_type}/old/${draw_number}/draw.json`);
      } else {
        return await loadJsonFile<SvenskaSpelDraw>(`./draws/${this.game_type}/current/draw.json`);
      }
    } catch (error) {
      if (isError(error)) {
        console.error(`getResult, error code: ${getError(error).name}`);
      }
      return undefined;
    }
  }
}

function isError(error: unknown): boolean {
  return error instanceof TypeError;
}
function getError(error: unknown): TypeError {
  return error as TypeError;
}
