import _ from 'lodash';
import { DrawConfig } from '../../analyze/draw-config';
import { Event, Line, Outcome } from '../interfaces';

function recursiveLines(draw_config: DrawConfig, events: Event[], index: number, outcome: Outcome, line?: Line): Line[] {
  if (!line) {
    line = {
      outcomes: [],
      total_odds: 1.0,
      total_bet_rate: 0.0,
      bet_score: 0.0,
    };
    index = -1;
  } else {
    line.outcomes.push(outcome);
    console.log(`events[index]: ${JSON.stringify(events[index], null, 2)}`);
    console.log(`outcome: ${JSON.stringify(outcome, null, 2)}`);
    let outcome_string = 'draw';
    if (outcome === Outcome.HOME) {
      outcome_string = 'home';
    } else if (outcome === Outcome.AWAY) {
      outcome_string = 'away';
    }
    line.total_odds *= events[index][outcome_string].odds;
    line.total_bet_rate += events[index][outcome_string].bet_value_normalized;
    line.bet_score +=
      events[index][outcome_string].odds_in_percentage_normalized + events[index][outcome_string].bet_value_normalized;
    if (events[index][outcome_string].odds === 0) {
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
    return _.flatten(
      Object.keys(Outcome).map((type) => recursiveLines(draw_config, events, index, type as Outcome, _.cloneDeep(line))),
    );
  }
}

export function generateLines(draw_config: DrawConfig, events: Event[]): Line[] {
  console.log('events: ', JSON.stringify(events, null, 2));
  const start = Date.now();
  console.log('Generating combinations...');

  const all_lines = recursiveLines(draw_config, events, -1, Outcome.HOME);
  console.log(`events: ${events.length}`);
  // console.log("all_lines: ", JSON.stringify(all_lines, null, 2));
  const delta = Date.now() - start;
  console.log(`${Math.floor(delta / 1000)} s`); // in seconds

  console.log(`Done generating combinations: ${all_lines.length}`);
  const all_lines_filtered = all_lines.filter((line) => {
    const no_of_1 = line.outcomes.reduce(
      (accumulator, currentValue) => (currentValue === 'home' ? accumulator + 1 : accumulator),
      0,
    );
    const no_of_2 = line.outcomes.reduce(
      (accumulator, currentValue) => (currentValue === 'away' ? accumulator + 1 : accumulator),
      0,
    );
    // return line.outcomes.length === 13 && no_of_1 > 1 && no_of_x > draw_config.number_of_X_signs && no_of_2 > 1;
    return line.outcomes.length === 13 && no_of_1 > 1 && no_of_2 > 1;
  });
  console.log(`Done generating combinations, has 13 events: ${all_lines_filtered.length}`);
  return all_lines_filtered;
}
