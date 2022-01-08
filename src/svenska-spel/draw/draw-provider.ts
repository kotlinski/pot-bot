import SvenskaSpelApiClient from '../api-clients/svenska-spel-api-client';
import { ApiDraw } from '../api-clients/interfaces/api-interfaces';
import DrawStore from '../../storage/draw-store';
import DrawHelper from './draw-helper';
import { formatApiDraw } from './draw-formatter';
import { SvenskaSpelDraw } from '../api-clients/interfaces/svenskaspel-draw-interfaces';

export default class DrawProvider {
  private readonly draw_helper: DrawHelper;
  constructor(private readonly api_client: SvenskaSpelApiClient, private readonly draw_store: DrawStore) {
    this.draw_helper = new DrawHelper();
  }
  public async getDraw(draw_number?: number): Promise<ApiDraw> {
    try {
      const draw = await this.getSvenskaSpelDraw(draw_number);
      return formatApiDraw(draw);
    } catch (error) {
      console.error(`failed getting draw: ${draw_number ?? 'current'}`);
      throw error;
    }
  }

  private async getSvenskaSpelDraw(draw_number?: number): Promise<SvenskaSpelDraw> {
    const stored_draw = await this.draw_store.getDraw(draw_number);
    if (stored_draw === undefined || this.isDrawCloseToDeadline(stored_draw)) {
      const draw = await this.api_client.fetchDraw(draw_number);
      console.log(`${this.draw_helper.minutesUntilClose(draw)} minutes until close time.`);
      await this.draw_store.storeDraw(draw);
      return draw;
    } else {
      return stored_draw;
    }
  }

  private isDrawCloseToDeadline(draw: SvenskaSpelDraw): boolean {
    const minutes_until_close = this.draw_helper.minutesUntilClose(draw);
    return minutes_until_close > 0 && minutes_until_close < 90;
  }
}
