import { EVENT_OUTCOME_TYPES } from '../event-outcome-types';

export function getAllPossibleCombinations() {
  const lines = [];

  console.log('Generating combinations...');

  for (const _outcome_event_1 of EVENT_OUTCOME_TYPES) {
    for (const _outcome_event_2 of EVENT_OUTCOME_TYPES) {
      for (const _outcome_event_3 of EVENT_OUTCOME_TYPES) {
        for (const _outcome_event_4 of EVENT_OUTCOME_TYPES) {
          for (const _outcome_event_5 of EVENT_OUTCOME_TYPES) {
            for (const _outcome_event_6 of EVENT_OUTCOME_TYPES) {
              for (const _outcome_event_7 of EVENT_OUTCOME_TYPES) {
                for (const _outcome_event_8 of EVENT_OUTCOME_TYPES) {
                  for (const _outcome_event_9 of EVENT_OUTCOME_TYPES) {
                    for (const _outcome_event_10 of EVENT_OUTCOME_TYPES) {
                      for (const _outcome_event_11 of EVENT_OUTCOME_TYPES) {
                        for (const _outcome_event_12 of EVENT_OUTCOME_TYPES) {
                          for (const _outcome_event_13 of EVENT_OUTCOME_TYPES) {
                            const line = [];
                            for (let event_index = 0; event_index < 13; event_index++) {
                              line.push(eval(`outcome_event_${event_index + 1}`));
                            }
                            lines.push(line);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  console.log('Done generating combinations');
  return lines;
}

/*
function gameStringToStringToChar(gameString) {
  if (gameString === 'home') {
    return '1';
  } else if (gameString === 'draw') {
    return 'X';
  } else if (gameString === 'away') {
    return '2';
  }
}*/

/*

function createCombinationObject(events, outcome_event_1, outcome_event_2, outcome_event_3, outcome_event_4, outcome_event_5, outcome_event_6, outcome_event_7, outcome_event_8, outcome_event_9, outcome_event_10, outcome_event_11, outcome_event_12, outcome_event_13) {

  let odds_rate = 1;
  let bet_value_rate = 1;
  let score = 0;

  let index = 1;
  events.forEach(event => {
    bet_value_rate += event.bet_value_rate[eval(`game${index}`)];
    odds_rate += event.odds_rate[eval(`game${index}`)];
    if (event.outcome) {
      score += event.outcome[eval(`game${index}`)];
    }
    index++;
  });

  const line_id = [];
  for (let game_index = 1; game_index < 14; game_index++) {
    line_id.push(`${gameStringToStringToChar(eval(`game${game_index}`))}`);
  }
  return {
    id: line_id.join(''),
    output_format: 'E,' + line_id.join(','),
    odds_rate,
    bet_value_rate,
    score
  };
}
*/
