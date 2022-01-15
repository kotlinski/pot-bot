import { Event } from '../svenska-spel/interfaces';
/*
function getHighestOddsPercentage(events: Event[]){
}
function getLowestOddsPercentage(events: Event[]){
}
function iterator(events: Event[], property: string, operator: (...values: number[]) => number): number{
/*  let val: number;
  events.forEach((event: Event) => {
    const calculated_values = event.calculated_values;
    const values = Object.values(Outcome).map((outcome: Outcome) => calculated_values.get(outcome)![property]);
    val = operator(val,...values);
  });
  return val
}*/

export function normalizeProperty(_events: Event[], _property: 'odds_in_percentage' | 'bet_value'): any {
  /*
}
  let lowest = Number.POSITIVE_INFINITY;
  let highest = Number.NEGATIVE_INFINITY;
  events.forEach((event: Event) => {
    let calculated_values = event.calculated_values;
    const values = Object.values(Outcome).map((outcome: Outcome) => calculated_values.get(outcome)![property]);
    lowest = Math.min(lowest,...values);
  });
  events.forEach((event: Event) => {
    let calculated_values = event.calculated_values;
    const values = Object.values(Outcome).map((outcome: Outcome) => calculated_values.get(outcome)![property]);
    highest = Math.max(highest,...values);
  });

  events = events.map((event: Event) => {
    console.log(`event: ${JSON.stringify(event, null, 2)}`);
    // for (const outcome: Outcome in Object.keys(Outcome)) {

    for (const outcome of Object.values(Outcome)) {
    event.calculated_values[outcome][`${property}_normalized`] = event[outcome][property] - lowest;
    event[outcome][`${property}_normalized`] = event[outcome][property] - lowest;
    event[outcome][`${property}_normalized`] = event[outcome][property] - lowest;
    return event;
  });
  let highest = 0;

  events = events.map((event: Event) => {
    event[Outcome.HOME][`${property}_normalized`] =
      Math.round((event[Outcome.HOME][`${property}_normalized`] / highest) * 10000) / 10000;
    event[Outcome.DRAW][`${property}_normalized`] =
      Math.round((event[Outcome.DRAW][`${property}_normalized`] / highest) * 10000) / 10000;
    event[Outcome.AWAY][`${property}_normalized`] =
      Math.round((event[Outcome.AWAY][`${property}_normalized`] / highest) * 10000) / 10000;
    return event;
  });

  return events;*/
}
