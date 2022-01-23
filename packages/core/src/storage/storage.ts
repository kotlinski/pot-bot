import { SvenskaSpelDraw } from '../svenska-spel/api-clients/interfaces/svenskaspel-draw-interfaces';
import { SvenskaSpelResult } from '../svenska-spel/api-clients/interfaces/svenskaspel-result-interfaces';
import { Line } from '../svenska-spel/interfaces';

export abstract class Storage {
  abstract storeDraw(draw: SvenskaSpelDraw): Promise<void>;
  abstract getDraw(draw_number?: number): Promise<SvenskaSpelDraw | undefined>;
  abstract storeResult(result: SvenskaSpelResult): Promise<void>;
  abstract getResult(draw_number?: number): Promise<SvenskaSpelResult | undefined>;
  abstract storeBets(lines: Line[], draw_number?: number): Promise<void>;
}
