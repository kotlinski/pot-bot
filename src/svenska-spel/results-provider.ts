import SvenskaSpelApiClient from './api-clients/svenska-spel-api-client';
import { ApiDraw, ApiEvent } from './api-clients/interfaces/api-interfaces';
import DrawStore from '../storage/draw-store';
import { SvenskaSpelDraw, SvenskaSpelEvent } from './api-clients/interfaces/svenskaspel-interfaces';
import { HomeAwayDraw } from './interfaces';
import DrawHelper from './draw-helper';

export default class ResultsProvider {
  private readonly draw_helper: DrawHelper;
  constructor(private readonly api_client: SvenskaSpelApiClient, private readonly draw_store: DrawStore) {
    this.draw_helper = new DrawHelper();
  }
  public async getDraw(draw_number?: number): Promise<ApiDraw> {
    const draw = await this.getSvenskaSpelDraw(draw_number);
    console.log('got draw');
    return {
      draw_comment: draw.drawComment,
      events: draw.events.map(ResultsProvider.formatEvent),
      draw_number: draw.drawNumber,
      open_time: draw.openTime,
      close_time: draw.closeTime,
      turnover: draw.turnover,
      jackpot_items: draw.jackpotItems,
    };
  }

  private async getSvenskaSpelDraw(draw_number?: number): Promise<SvenskaSpelDraw> {
    console.log('getSvenskaSpelDraw');
    const stored_draw = await this.draw_store.getDraw(draw_number);
    console.log('got draw..');
    if (stored_draw === undefined || this.isDrawCloseToDeadline(stored_draw)) {
      const draw = await this.api_client.fetchDraw(draw_number);
      await this.draw_store.storeDraw(draw);
      return draw;
    } else {
      return stored_draw;
    }
  }

  private static formatEvent(event: SvenskaSpelEvent): ApiEvent {
    return {
      event_number: event.eventNumber,
      description: event.description,
      cancelled: event.cancelled,
      odds: DrawProvider.formatHomeDrawAway<string>(event.odds),
      distribution: DrawProvider.formatHomeDrawAway<string>(event.odds),
      newspaper_advice: DrawProvider.formatHomeDrawAway<string>(event.odds),
      participants: event.participants,
      sport_event_start: event.sportEventStart,
      sport_event_status: event.sportEventStatus,
    };
  }

  private static formatHomeDrawAway<T>(odds: { home: T; draw: T; away: T }): HomeAwayDraw<T> {
    return {
      home: odds.home,
      draw: odds.draw,
      away: odds.away,
    };
  }

  private isDrawCloseToDeadline(draw: SvenskaSpelDraw): boolean {
    const minutes_until_close = this.draw_helper.minutesUntilClose(draw);
    console.log(`${minutes_until_close} minutes until close time.`);
    return minutes_until_close > 0 && minutes_until_close < 90;
  }
}
