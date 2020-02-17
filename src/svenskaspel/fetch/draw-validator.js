import moment from "moment";

const api = {

  hasOdds(draw) {
    for (const event of draw.events) {
      if (!event.odds) {
        return false;
      }
    }
    return true;
  },

  isCurrentDraw(draw) {
    const open_time = moment(draw.openTime);
    const close_time = moment(draw.closeTime);
    return moment().isBetween(open_time, close_time);
  },

  isAfterCloseTime(draw) {
    const close_time = moment(draw.closeTime);
    return moment().isAfter(close_time);
  },

  isLastDay(current_draw) {
    const close_time = moment(current_draw.closeTime);
    return moment().isSame(close_time, 'day');
  },

  hoursUntilCloseTime(draw) {
    const close_time = moment(draw.closeTime);
    return -1*moment().diff(close_time, 'minutes');
  }
};

export default api;
