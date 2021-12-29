import moment from 'moment';
import { SvenskaSpelDraw } from '../../svenska-spel/api-clients/svenskaspel-interfaces';

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
    const open_time = moment(draw.openTime);
    const close_time = moment(draw.closeTime);
    return moment().isBetween(open_time, close_time);
  }

  public isAfterCloseTime(draw: SvenskaSpelDraw): boolean {
    const close_time = moment(draw.closeTime);
    return moment().isAfter(close_time);
  }

  public isLastDay(current_draw: SvenskaSpelDraw): boolean {
    const close_time = moment(current_draw.closeTime);
    return moment().isSame(close_time, 'day');
  }

  public minutesUntilClose(draw: SvenskaSpelDraw): number {
    const close_time = moment(draw.closeTime);
    return -1 * moment().diff(close_time, 'minutes');
  }
}
