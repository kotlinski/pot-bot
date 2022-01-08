import optimist from 'optimist';
import { BaseInput } from './command-line-interfaces';
import { ScriptFactory } from './script-factory';

class ScriptRunner {
  readonly input: BaseInput;
  readonly script_factory: ScriptFactory;
  constructor() {
    this.input = optimist.demand(['script', 'game_type']).argv as BaseInput;
    console.log(`Starting script ${this.input.script}`);

    this.script_factory = new ScriptFactory();
  }
  public async runScript(): Promise<void> {
    const script = this.script_factory.create(this.input.script);
    await script.run();
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
