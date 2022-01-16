import { ApiDraw, ApiDrawEvent } from '../api-clients/interfaces/api-interfaces';
import { HomeAwayDraw } from '../interfaces';
import { SvenskaSpelDraw, SvenskaSpelDrawEvent } from '../api-clients/interfaces/svenskaspel-draw-interfaces';

export function formatApiDraw(draw: SvenskaSpelDraw): ApiDraw {
  try {
    return {
      draw_comment: draw.drawComment,
      events: draw.events.map(formatEvent),
      draw_number: draw.drawNumber,
      open_time: draw.openTime,
      close_time: draw.closeTime,
      turnover: draw.turnover,
      jackpot_items: draw.jackpotItems,
    };
  } catch (error) {
    console.error('failed formatting draw');
    throw error;
  }
}
function formatEvent(event: SvenskaSpelDrawEvent): ApiDrawEvent {
  const odds = event.odds || event.startOdds ? formatHomeDrawAway(event.odds ?? event.startOdds!) : undefined;
  const newspaper_advice = event.newspaperAdvice ? formatHomeDrawAway<string>(event.newspaperAdvice) : undefined;
  return {
    event_number: event.eventNumber,
    description: event.description,
    cancelled: event.cancelled,
    odds,
    distribution: formatHomeDrawAway<string>(event.distribution),
    newspaper_advice,
    participants: event.participants,
    sport_event_start: event.sportEventStart,
    sport_event_status: event.sportEventStatus,
  };
}

function formatHomeDrawAway<T>(odds: { home: T; draw: T; away: T }): HomeAwayDraw<T> {
  return {
    home: odds.home,
    draw: odds.draw,
    away: odds.away,
  };
}
