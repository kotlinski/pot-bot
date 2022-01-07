import { ensureDir, outputJSON } from 'fs-extra';
import moment from 'moment';
import { SvenskaSpelDraw } from '../svenska-spel/api-clients/interfaces/svenskaspel-interfaces';
import DrawHelper from '../svenska-spel/draw-helper';
import { GameType } from '../script/command-line-interfaces';
import loadJsonFile from 'load-json-file';

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
      await outputJSON(`${base_dir}/draw.json`, draw, { spaces: 2 });
      if (this.draw_helper.isBeforeCloseTime(draw)) {
        await outputJSON(`${base_dir}/draw-before-deadline.json`, draw, { spaces: 2 });
      }
      if (!this.draw_helper.hasOdds(draw)) {
        await outputJSON(`${base_dir}/draw-without-odds.json`, draw, { spaces: 2 });
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
    console.log(`draw_number: ${JSON.stringify(draw_number, null, 2)}`);
    try {
      if (draw_number) {
        return await loadJsonFile<SvenskaSpelDraw>(`./draws/${this.game_type}/old/${draw_number}/draw.json`);
      } else {
        return await loadJsonFile<SvenskaSpelDraw>(`./draws/${this.game_type}/current/draw.json`);
      }
    } catch (error) {
      console.log(`error!!!: ${JSON.stringify(error, null, 2)}`);
      return undefined;
    }
  }

  /*
  public async storeDraw(draw: SvenskaSpelDraw): Promise<void> {
    const draw_number = draw.drawNumber;
    await makeDir(`./draws/${this.game_type}/old/${draw_number}/draw-history/`);
    let file_name: string;

    await writeJsonFile(`draws/${this.game_type}/old/${draw_number}/${file_name}`, draw, { indent: 2 });
    await writeJsonFile(`draws/${this.game_type}/old/${draw_number}/draw-history/${DrawStore.getFormattedToday()}.json`, draw, {
      indent: 2,
    });

    if (this.draw_helper.isCurrentDraw(draw)) {
      await this.storeDraw(draw);
    }
  }*/

  /*
    public async storeResults(game_type: string, results: any): Promise<void> {
      const draw_number = results.drawNumber;
      await mkdirSync(`./draws/${game_type}/old/${draw_number}`, { recursive: true });
      await writeJsonFile(`draws/${game_type}/old/${draw_number}/results.json`, results, {
        indent: 2,
      });
    }*/
  /*
  public async function storeCleanDraw(game_type: string, clean_draw: any): Promise<void> {
    const draw_number = clean_draw.drawNumber;
    await mkdirSync(`./draws/${game_type}/${draw_number}/calculations`, { recursive: true });
    await writeJson(`draws/${game_type}/${draw_number}/calculations/clean.json`, clean_draw, { spaces: 2, EOL: '\n' });
    if (draw_validator.isCurrentDraw(clean_draw)) {
      await storeCurrentCleanDraw(game_type, clean_draw);
    }
  }*/
  /*  public async getFinalBets(game_type: string, file_name = 'final'): Promise<SvenskaSpelDraw> {
    return readJson(`./draws/${game_type}/current/${file_name}.json`);
  }*/
  /*

  /*  public async storeCurrentCleanDraw(clean_draw: any) {
      mkdirSync(`./draws/${this.game_type}/current`, { recursive: true });
      await writeJson(`draws/${this.game_type}/current/clean-draw.json`, clean_draw, {
        spaces: 2,
        EOL: '\n',
      });
    }*/
}
