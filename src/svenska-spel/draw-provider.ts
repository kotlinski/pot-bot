import SvenskaSpelApiClient from './api-clients/svenska-spel-api-client';
import { ApiDraw, ApiEvent } from './api-clients/api-interfaces';
import DrawStore from '../storage/draw-store';
import { SvenskaSpelDraw, SvenskaSpelEvent } from './api-clients/svenskaspel-interfaces';
import { HomeAwayDraw } from '../svenskaspel/interfaces';
import DrawHelper from '../svenskaspel/fetch/draw-validator';

export default class DrawProvider {
  private readonly draw_helper: DrawHelper;
  constructor(private readonly api_client: SvenskaSpelApiClient, private readonly draw_store: DrawStore) {
    this.draw_helper = new DrawHelper();
  }
  public async getCurrentDraw(): Promise<ApiDraw> {
    const stored_draw = await this.draw_store.getCurrentDraw();
    let draw: SvenskaSpelDraw;
    if (this.isStoredDrawUpToDate(stored_draw)) {
      draw = await this.api_client.fetchCurrentDraw();
      await this.draw_store.storeCurrentDraw(draw);
    } else {
      draw = stored_draw;
    }
    return {
      draw_comment: draw.drawComment,
      events: draw.events.map(DrawProvider.formatEvent),
      draw_number: draw.drawNumber,
      open_time: draw.openTime,
      close_time: draw.closeTime,
      turnover: draw.turnover,
      jackpot_items: draw.jackpotItems,
    };
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

  private isStoredDrawUpToDate(stored_draw: SvenskaSpelDraw): boolean {
    const is_current_draw = this.draw_helper.isCurrentDraw(stored_draw);
    const minutes_until_close = this.draw_helper.minutesUntilClose(stored_draw);
    return !is_current_draw || (minutes_until_close > 0 && minutes_until_close < 60);
  }
}
