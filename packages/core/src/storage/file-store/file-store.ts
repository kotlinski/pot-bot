import { ensureDir, outputFile, outputJSON } from 'fs-extra';
import DrawHelper from '../../svenska-spel/draw/draw-helper';
import { GameType } from '../../script/command-line-interfaces';
import loadJsonFile from 'load-json-file';
import { SvenskaSpelDraw } from '../../svenska-spel/api-clients/interfaces/svenskaspel-draw-interfaces';
import { Storage } from '../storage';
import { SvenskaSpelResult } from '../../svenska-spel/api-clients/interfaces/svenskaspel-result-interfaces';
import { Line } from '../../svenska-spel/interfaces';
import { formatBets } from '../formatter';
import FileStoreHelper from './file-store-helper';

import isError from 'lodash.iserror';

export default class FileStore implements Storage {
  private readonly draw_helper: DrawHelper;
  private readonly store_helper: FileStoreHelper;

  constructor(private readonly game_type: GameType) {
    this.draw_helper = new DrawHelper();
    this.store_helper = new FileStoreHelper(game_type, this.draw_helper);
  }

  public async storeDraw(draw: SvenskaSpelDraw): Promise<void> {
    const base_dirs = [`./draws/${this.game_type}/old/${draw.drawNumber}`];
    if (this.draw_helper.isCurrentDraw(draw)) {
      base_dirs.push(`./draws/${this.game_type}/current`);
    }
    await this.store_helper.storeDrawToBaseDirs(base_dirs, draw);
    await this.store_helper.storeToDrawHistory(draw);
  }

  public async getDraw(draw_number?: number): Promise<SvenskaSpelDraw | undefined> {
    try {
      if (draw_number) {
        return await loadJsonFile<SvenskaSpelDraw>(`./draws/${this.game_type}/old/${draw_number}/draw.json`);
      } else {
        return await loadJsonFile<SvenskaSpelDraw>(`./draws/${this.game_type}/current/draw.json`);
      }
    } catch (error) {
      if (isError(error)) {
        console.error(`getDraw, error code: ${error.name}`);
      }
      return undefined;
    }
  }

  public async storeResult(result: SvenskaSpelResult): Promise<void> {
    const base_dirs = [`./draws/${this.game_type}/old/${result.drawNumber}`];
    const current_draw = await this.getDraw();
    if (current_draw !== undefined && result.drawNumber === current_draw.drawNumber) {
      base_dirs.push(`./draws/${this.game_type}/current`);
    }
    await this.store_helper.storeResultToBaseDirs(base_dirs, result);
  }

  public async getResult(draw_number?: number): Promise<SvenskaSpelResult | undefined> {
    try {
      if (draw_number) {
        return await loadJsonFile<SvenskaSpelResult>(`./draws/${this.game_type}/old/${draw_number}/result.json`);
      } else {
        return await loadJsonFile<SvenskaSpelResult>(`./draws/${this.game_type}/current/result.json`);
      }
    } catch (error) {
      if (isError(error)) {
        console.error(`getResult, error code: ${error.name}`);
      }
      return undefined;
    }
  }

  public async storeBets(lines: Line[], draw_number: number): Promise<void> {
    for (const sub_folder of ['current', `old/${draw_number}`]) {
      const base_dir = `./draws/${this.game_type}/${sub_folder}`;
      await ensureDir(base_dir);
      await outputJSON(`${base_dir}/bets.json`, lines, { spaces: 2 });
      const bets = formatBets(this.game_type, lines);
      await outputFile(`${base_dir}/bets.txt`, bets);
    }
  }
}
