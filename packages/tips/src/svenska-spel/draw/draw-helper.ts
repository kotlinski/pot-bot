import dayjs from 'dayjs';
import { SvenskaSpelDraw } from '../api-clients/interfaces/svenskaspel-draw-interfaces';

export default class DrawHelper {
  public hasOdds(draw: SvenskaSpelDraw): boolean {
    for (const event of draw.events) {
      if (!event.odds) {
        return false;
      }
    }
    return true;
  }

  public isCurrentDraw(draw: SvenskaSpelDraw): boolean {
    const open_time = dayjs(draw.openTime);
    const close_time = dayjs(draw.closeTime);
    return dayjs().isAfter(open_time) && dayjs().isBefore(close_time);
  }

  public isAfterCloseTime(draw: SvenskaSpelDraw): boolean {
    const close_time = dayjs(draw.closeTime);
    return dayjs().isAfter(close_time);
  }

  public isBeforeCloseTime(draw: SvenskaSpelDraw): boolean {
    const close_time = dayjs(draw.closeTime);
    return dayjs().isBefore(close_time);
  }

  public isLastDay(current_draw: SvenskaSpelDraw): boolean {
    const close_time = dayjs(current_draw.closeTime);
    return dayjs().isSame(close_time, 'day');
  }

  public minutesUntilClose(draw: SvenskaSpelDraw): number {
    const close_time = dayjs(draw.closeTime);
    return -1 * dayjs().diff(close_time, 'minutes');
  }
}
