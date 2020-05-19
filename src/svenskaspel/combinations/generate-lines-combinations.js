import {EVENT_OUTCOME_TYPES} from "../event-outcome-types";
import _ from 'lodash';

function recursiveLines(events, line, index, outcome) {
  if (!line) {
    line = {
      outcomes: [],
      total_odds: 1.0,
      total_bet_rate: 0.0,
      bet_score: 0.0,
    };
    index = -1
  } else {
    line.outcomes.push(outcome);
    line.total_odds *= events[index][outcome].odds;
    line.total_bet_rate += events[index][outcome].bet_value_normalized;
    line.bet_score += (events[index][outcome].odds_in_percentage * 3.0 + events[index][outcome].bet_value_normalized);
    /*    if (events[index][outcome].bet_value_normalized <= 0.05) {
          return [];
        }*/
    /*    if (events[index][outcome].bet_value <= 0.10) {
          return [];
        }*/
  }

  if (line.total_odds > 1594323) {
    return [];
  }
  index += 1;

  if (index === 13) {
    return [line];
  } else {
    return _.flatten(EVENT_OUTCOME_TYPES.map(type => {
      return recursiveLines(events, _.cloneDeep(line), index, type);
    }));
  }
}

export function generateLines(events) {
  console.log("events: ", JSON.stringify(events, null, 2));
  const start = Date.now();
  console.log("Generating combinations...");

  const all_lines = recursiveLines(events);
  console.log(`events: ${events.length}`);
  // console.log("all_lines: ", JSON.stringify(all_lines, null, 2));
  const delta = Date.now() - start;
  console.log((Math.floor(delta / 1000)) + " s"); // in seconds

  console.log("Done generating combinations: " + all_lines.length);
  const all_lines_filtered = all_lines.filter(line => line.outcomes.length === 13);
  console.log("Done generating combinations, has 13 events: " + all_lines_filtered.length);
  return all_lines_filtered;
}
