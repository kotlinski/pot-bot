import moment from "moment";


const api = {

  hasOdds(draw: any) {
    for (const event of draw.events) {
      if (!event.odds) {
        return false;
      }
    }
    return true;
  },

  isCurrentDraw(draw: any) {
    const open_time = moment(draw.openTime);
    const close_time = moment(draw.closeTime);
    return moment().isBetween(open_time, close_time);
  },

  isAfterCloseTime(draw: any) {
    const close_time = moment(draw.closeTime);
    return moment().isAfter(close_time);
  },

  isLastDay(current_draw: any) {
    const close_time = moment(current_draw.closeTime);
    return moment().isSame(close_time, 'day');
  },

  hoursUntilCloseTime(draw: any) {
    const close_time = moment(draw.closeTime);
    return -1 * moment().diff(close_time, 'minutes');
  },

  closeTime(draw: any) {
    return moment(draw.closeTime);
  }
};

export default api;
