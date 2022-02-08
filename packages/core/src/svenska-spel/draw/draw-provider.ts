import SvenskaSpelApiClient from '../api-clients/svenska-spel-api-client';
import { ApiDraw } from '../api-clients/interfaces/api-interfaces';
import DrawHelper from './draw-helper';
import { formatApiDraw } from './draw-formatter';
import { SvenskaSpelDraw } from '../api-clients/interfaces/svenskaspel-draw-interfaces';
import { Storage } from '../../storage/storage';
import * as console from 'console';

export default class DrawProvider {
  private readonly draw_helper: DrawHelper;
  constructor(private readonly api_client: SvenskaSpelApiClient, private readonly storage: Storage) {
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
    const stored_draw = await this.storage.getDraw(draw_number);
    if (stored_draw === undefined || this.isDrawCloseToDeadline(stored_draw) || this.isLastWeeksDraw(stored_draw)) {
      let draw: SvenskaSpelDraw;
      try {
        draw = await this.api_client.fetchDraw(draw_number);
      } catch (error) {
        console.log(`No ongoing draw, looking for upcoming`);
        draw = await this.api_client.fetchUpcomingDraw();
      }
      console.log(`${this.draw_helper.minutesUntilClose(draw)} minutes until close time.`);
      await this.storage.storeDraw(draw);
      return draw;
    } else {
      return stored_draw;
    }
  }

  private isDrawCloseToDeadline(draw: SvenskaSpelDraw): boolean {
    const minutes_until_close = this.draw_helper.minutesUntilClose(draw);
    return minutes_until_close > 0 && minutes_until_close < 90;
  }
  private isLastWeeksDraw(draw: SvenskaSpelDraw): boolean {
    const minutes_until_close = this.draw_helper.minutesUntilClose(draw);
    return minutes_until_close < 0;
  }
}
