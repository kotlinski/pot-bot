import optimist from 'optimist';
import { ScriptName, ScriptArg } from './command-line-interfaces';
import CurrentDrawAnalyzer from './scripts/current-draw-analyzer';
import { ScriptWrapper } from './script-wrapper';
import DrawProvider from '../svenska-spel/draw-provider';
import SvenskaSpelApiClient from '../svenska-spel/api-clients/svenska-spel-api-client';
import config from 'config';
import DrawStore from '../storage/draw-store';

class ScriptRunner {
  readonly script_args: ScriptArg;
  readonly script_factory: ScriptFactory;
  constructor() {
    const access_key = config.get('svenska_spel_api.access_key');
    this.script_args = optimist.demand(['script', 'game_type']).default('api_key', access_key).argv as ScriptArg;
    console.log(`Starting script ${this.script_args.script}`);
    const api_client = new SvenskaSpelApiClient(this.script_args.api_key, this.script_args.game_type);
    const draw_store = new DrawStore(this.script_args.game_type);
    const draw_provider = new DrawProvider(api_client, draw_store);
    this.script_factory = new ScriptFactory(draw_provider);
  }
  public async runScript(): Promise<void> {
    const script = this.script_factory.create(this.script_args.script);
    await script.run(script.parseInput());
  }
}

class ScriptFactory {
  constructor(private readonly draw_provider: DrawProvider) {}
  public create(script: ScriptName): ScriptWrapper {
    switch (script) {
      case ScriptName.ANALYZE_CURRENT_DRAW:
        return new CurrentDrawAnalyzer(this.draw_provider);
    }
  }
}

(async () => {
  const script_runner = new ScriptRunner();
  await script_runner.runScript();
})().catch((e) => {
  if (typeof e === 'string') {
    console.log(`error, ${e.toUpperCase()}`);
  } else if (e instanceof Error) {
    console.log(`error, ${e.message}`);
  }
});
