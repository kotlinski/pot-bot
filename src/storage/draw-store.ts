import draw_validator from '../svenskaspel/fetch/draw-validator';
import moment from 'moment';
import { mkdirSync } from 'fs';
import { SvenskaSpelDraw } from '../svenska-spel/api-clients/svenskaspel-interfaces';
import { loadJsonFile } from 'load-json-file';
import { writeJsonFile } from 'write-json-file';
import makeDir from 'make-dir';

export default class DrawStore {
  constructor(private readonly game_type: 'stryktipset' | 'europatipset') {}

  public async storeCurrentDraw(draw: SvenskaSpelDraw): Promise<void> {
    mkdirSync(`./draws/${this.game_type}/current`, { recursive: true });
    let file_name = `draw-before-deadline.json`;
    if (!draw_validator.hasOdds(draw)) {
      file_name = `draw-without-odds.json`;
    }
    await writeJsonFile(`draws/${this.game_type}/current/${file_name}`, draw, { indent: 2 });
  }

  public async storeDraw(draw: SvenskaSpelDraw): Promise<void> {
    const draw_number = draw.drawNumber;
    await makeDir(`./draws/${this.game_type}/old/${draw_number}/draw-history/`);
    let file_name: string;
    if (draw_validator.isAfterCloseTime(draw)) {
      file_name = `draw-after-deadline.json`;
    } else if (!draw_validator.hasOdds(draw)) {
      file_name = `draw-without-odds.json`;
    } else {
      file_name = `draw-before-deadline.json`;
    }
    await writeJsonFile(`draws/${this.game_type}/old/${draw_number}/${file_name}`, draw, { indent: 2 });
    await writeJsonFile(`draws/${this.game_type}/old/${draw_number}/draw-history/${DrawStore.getFormattedToday()}.json`, draw, {
      indent: 2,
    });

    if (draw_validator.isCurrentDraw(draw)) {
      await this.storeCurrentDraw(draw);
    }
  }

  public async getDraw(draw_number: number): Promise<SvenskaSpelDraw> {
    return loadJsonFile<SvenskaSpelDraw>(`./draws/${this.game_type}/old/${draw_number}/draw-before-deadline.json`);
  }
  public async getCurrentDraw(): Promise<SvenskaSpelDraw> {
    return loadJsonFile<SvenskaSpelDraw>(`./draws/${this.game_type}/current/draw-before-deadline.json`);
  }
  private static getFormattedToday() {
    return moment().format('YYYYMMDDTHHmm');
  }

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
