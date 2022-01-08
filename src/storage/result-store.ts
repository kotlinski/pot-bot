import { ensureDir, outputJSON } from 'fs-extra';
import { GameType } from '../script/command-line-interfaces';
import loadJsonFile from 'load-json-file';
import { SvenskaSpelResult } from '../svenska-spel/api-clients/interfaces/svenskaspel-result-interfaces';
import { ScriptFactory } from '../script/script-factory';
import DrawProvider from '../svenska-spel/draw/draw-provider';

export default class ResultStore {
  private readonly drawProvider: DrawProvider;

  constructor(private readonly game_type: GameType) {
    this.drawProvider = ScriptFactory.createDrawProvider();
  }

  public async storeResult(result: SvenskaSpelResult): Promise<void> {
    const base_dirs = [`./draws/${this.game_type}/old/${result.drawNumber}`];
    const current_draw = await this.drawProvider.getDraw();
    if (result.drawNumber === current_draw.draw_number) {
      base_dirs.push(`./draws/${this.game_type}/current`);
    }
    await storeResultToBaseDirs(base_dirs, result);
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
        console.error(`getResult, error code: ${getError(error).name}`);
      }
      return undefined;
    }
  }
}

async function storeResultToBaseDirs(base_dirs: string[], result: SvenskaSpelResult): Promise<void> {
  for (const base_dir of base_dirs) {
    await ensureDir(base_dir);
    await outputJSON(`${base_dir}/result.json`, result, { spaces: 2 });
  }
}
function isError(error: unknown): boolean {
  return error instanceof TypeError;
}
function getError(error: unknown): TypeError {
  return error as TypeError;
}
