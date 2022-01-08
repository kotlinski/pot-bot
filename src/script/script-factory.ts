import { BaseInput, ScriptName } from './command-line-interfaces';
import { ScriptWrapper } from './script-wrapper';
import GenerateBets from './scripts/generate-bets';
import AnalyzeFilter from './scripts/analyze-filter';
import DrawProvider from '../svenska-spel/draw/draw-provider';
import SvenskaSpelApiClient from '../svenska-spel/api-clients/svenska-spel-api-client';
import DrawStore from '../storage/draw-store';
import optimist from 'optimist';
import config from 'config';
import ResultProvider from '../svenska-spel/result/result-provider';
import ResultStore from '../storage/result-store';

interface ApiKeyInput extends BaseInput {
  api_key: string;
}

export class ScriptFactory {
  public create(script: ScriptName): ScriptWrapper {
    switch (script) {
      case ScriptName.GENERATE_BETS:
        return new GenerateBets();
      case ScriptName.ANALYZE_FILTER:
        return new AnalyzeFilter();
    }
  }

  public static createDrawProvider(): DrawProvider {
    const input = optimist.demand('game_type').argv as ApiKeyInput;
    const draw_store = new DrawStore(input.game_type);
    return new DrawProvider(this.createApiClient(), draw_store);
  }
  public static createResultProvider(): ResultProvider {
    const input = optimist.demand('game_type').argv as ApiKeyInput;
    const result_store = new ResultStore(input.game_type);
    return new ResultProvider(this.createApiClient(), result_store);
  }

  private static createApiClient(): SvenskaSpelApiClient {
    const default_api_key = config.get('svenska_spel_api.access_key');
    const input = optimist.demand('game_type').default('api_key', default_api_key).argv as ApiKeyInput;
    return new SvenskaSpelApiClient(input.api_key, input.game_type);
  }
}
