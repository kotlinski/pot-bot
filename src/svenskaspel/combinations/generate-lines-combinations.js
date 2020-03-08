import {AWAY, DRAW, EVENT_OUTCOME_TYPES, HOME} from "../event-outcome-types";
import _ from 'lodash';

function recursiveLines(events, line, index, outcome) {
  line.outcomes.push(outcome);
  line.total_odds *= events[index][outcome].odds;
  if (line.total_odds > 1594323) {
    return [];
  }
  index += 1;
  if (index === 13) {
    return [line];
  } else {
    let home = recursiveLines(events, _.cloneDeep(line), index, HOME);
    let draw = recursiveLines(events, _.cloneDeep(line), index, DRAW);
    let away = recursiveLines(events, _.cloneDeep(line), index, AWAY);

    let concat = _.concat(
        home,
        draw,
        away
    );
    return concat;
  }

}

export function generateLines(events) {
  const start = Date.now();
  console.log("Generating combinations...");
  let line = {
    outcomes: [],
    total_odds: 1.0,
  };
  //     bet_value: 0
  const home = recursiveLines(events, _.cloneDeep(line), 0, HOME);
  // console.log("home: " + home.length);
   const draw = recursiveLines(events, _.cloneDeep(line), 0, DRAW);
  // console.log("home: " + draw.length);
   const away = recursiveLines(events, _.cloneDeep(line), 0, AWAY);
  // console.log("home: " + away.length);
  const all_lines = _.concat(home, draw, away);
  const delta = Date.now() - start;
  console.log((Math.floor(delta / 1000)) + " s"); // in seconds

  console.log("Done generating combinations: " + all_lines.length);
  return all_lines;
}
