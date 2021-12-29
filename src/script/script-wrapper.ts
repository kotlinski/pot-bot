import { Input } from './command-line-interfaces';

export abstract class ScriptWrapper {
  abstract run(input: Input): Promise<void>;
  abstract parseInput(): Input;
}
