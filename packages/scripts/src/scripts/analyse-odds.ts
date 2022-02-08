import { ScriptWrapper } from '../script-wrapper';
import { Storage } from '@pot-bot/core';

interface OddsData {
  odds: number;
  tot_count: number;
  tot_correct_count: number;
}

export default class AnalyzeOdds implements ScriptWrapper {
  /*  private readonly _draw_provider: DrawProvider;
  private readonly _result_provider: ResultProvider;*/

  constructor(_storage: Storage) {
    /* const script_factory = new ScriptFactory();
    this._draw_provider = script_factory.createDrawProvider(storage);
    this._result_provider = script_factory.createResultProvider(storage);*/
  }

  async run(): Promise<void> {
    const odds_stats: Map<number, OddsData> = new Map<number, OddsData>();

    for (let draw_number = 4727; draw_number > 4266; draw_number--) {
      /*      const draw = await this.draw_provider.getDraw(draw_number);
      const results = await this.result_provider.getResult(draw_number);
      draw.events.forEach((event: ApiDrawEvent) => {
        results.events.forEach;
        event.odds.home;
      });*/
    }
    odds_stats.forEach((value: OddsData, key: number) => {
      console.log(key, value);
    });
  }
}
