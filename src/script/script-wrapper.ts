import { BaseInput } from './command-line-interfaces';

export abstract class ScriptWrapper {
  static input: BaseInput;
  abstract run(): Promise<void>;
}
