import {EVENT_OUTCOME_TYPES} from "../event-outcome-types";
import _ from 'lodash';
import {Outcome} from "../../analyze/analyze-draw";

function recursiveLines(events: any, index: number, outcome: Outcome, line?: Line): Line[] {
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
    line.bet_score += (events[index][outcome].odds_in_percentage_normalized * 1.5 + events[index][outcome].bet_value_normalized);
    if (events[index][outcome].odds === 0) {
      return [];
    }
  }

  if (line.total_odds > 1594323) {
    return [];
  }
  index += 1;

  if (index === 13) {
    return [line];
  } else {
    return _.flatten(EVENT_OUTCOME_TYPES.map(type => {
      return recursiveLines(events, index, type as Outcome, _.cloneDeep(line));
    }));
  }
}

interface Line {
  outcomes: Outcome[];
  total_odds: number;
  total_bet_rate: number;
  bet_score: number;
}

export function generateLines(events: any): Line[] {
  console.log("events: ", JSON.stringify(events, null, 2));
  const start = Date.now();
  console.log("Generating combinations...");

  const all_lines = recursiveLines(events, -1, Outcome.home);
  console.log(`events: ${events.length}`);
  // console.log("all_lines: ", JSON.stringify(all_lines, null, 2));
  const delta = Date.now() - start;
  console.log((Math.floor(delta / 1000)) + " s"); // in seconds

  console.log("Done generating combinations: " + all_lines.length);
  const all_lines_filtered = all_lines.filter(line => {
    const no_of_1 = line.outcomes.reduce((accumulator, currentValue) => (currentValue === 'home') ? accumulator+1 : accumulator, 0);
    const no_of_x = line.outcomes.reduce((accumulator, currentValue) => (currentValue === 'draw') ? accumulator+1 : accumulator, 0);
    const no_of_2 = line.outcomes.reduce((accumulator, currentValue) => (currentValue === 'away') ? accumulator+1 : accumulator, 0);
    return line.outcomes.length === 13 &&
        no_of_1 > 1 &&
        no_of_x > 2 &&
        no_of_2 > 2;
  });
  console.log("Done generating combinations, has 13 events: " + all_lines_filtered.length);
  return all_lines_filtered;
}
