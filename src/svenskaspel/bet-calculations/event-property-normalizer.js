import {EVENT_OUTCOME_TYPES} from '../event-outcome-types'


export function normalizeProperty(events, property) {
  let lowest = 1000000000;
  events.forEach(event => {
    lowest = Math.min(lowest, event.home[property], event.draw[property], event.away[property]);
  });
  events = events.map(event => {
    EVENT_OUTCOME_TYPES.forEach(outcome_type => {
      event[outcome_type][`${property}_normalized`] = event[outcome_type][property] - lowest;
    });
    return event;
  });
  let highest = 0;
  events.forEach(event => {
    highest = Math.max(highest, event.home[`${property}_normalized`], event.draw[`${property}_normalized`], event.away[`${property}_normalized`]);
  });
  events = events.map(event => {
    EVENT_OUTCOME_TYPES.forEach(outcome_type => {
      event[outcome_type][`${property}_normalized`] = Math.round((event[outcome_type][`${property}_normalized`] / highest) * 10000) / 10000;
    });
    return event;
  });

  return events;
}
