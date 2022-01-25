import { BaseInput, ScriptName } from './command-line-interfaces';
import { ScriptWrapper } from './script-wrapper';
import GenerateBets from './scripts/generate-bets';
import AnalyzeFilter from './scripts/analyze-filter';
import optimist from 'optimist';
import config from 'config';
import FindDeadlines from './scripts/find-deadlines';
import { DrawProvider, FileStore, ResultProvider, Storage, SvenskaSpelApiClient } from '@pot-bot/core';

interface ApiKeyInput extends BaseInput {
  api_key: string;
}

export class ScriptFactory {
  private readonly file_store: Storage;
  constructor() {
    const input = optimist.demand('game_type').argv as ApiKeyInput;
    this.file_store = new FileStore(input.game_type);
  }

  public create(script: ScriptName): ScriptWrapper {
    switch (script) {
      case ScriptName.GENERATE_BETS:
        return new GenerateBets(this.file_store);
      case ScriptName.ANALYZE_FILTER:
        return new AnalyzeFilter(this.file_store);
      case ScriptName.FIND_DEADLINES:
        return new FindDeadlines(this.file_store);
    }
  }

  public createDrawProvider(storage: Storage): DrawProvider {
    return new DrawProvider(ScriptFactory.createApiClient(), storage);
  }
  public createResultProvider(storage: Storage): ResultProvider {
    return new ResultProvider(ScriptFactory.createApiClient(), storage);
  }

  private static createApiClient(): SvenskaSpelApiClient {
    const default_api_key = config.get('svenska_spel_api.access_key');
    const input = optimist.demand('game_type').default('api_key', default_api_key).argv as ApiKeyInput;
    return new SvenskaSpelApiClient(input.api_key, input.game_type);
  }
}
