import {willAlignToOdds} from "../../analyze/bet-comperator";
import {convertOddsToIntegerPercentage} from "../bet-calculations/percentage-converter";

function sortOnHighestBestScore(combinations: any, number_of_lines_to_pick: number, draw: any) {
  const lines_to_pick = [];

  const sort = combinations.sort((a: any, b: any) => {
    // opposite b to a if doing a.total_odds / getting lowest odds as possible
    return b.bet_score - a.bet_score;
  });


  /*
    // Loop throw all possible bets
    let time_to_pick_each_result = Math.floor(Math.round(number_of_lines_to_pick / 39)) - 1;
    console.log("time_to_pick_each_result: ", JSON.stringify(time_to_pick_each_result, null, 2));

   draw one x in each game
    for (let n = 0; n < time_to_pick_each_result; n++) {
      for (let i = 0; i < 13; i++) {
        // for (const sign of signs) {
        const sign = 'draw';
        const line = sort.find(line => line.outcomes[i] === sign);
        if (line) {
          lines_to_pick.push(line);
          const index = sort.indexOf(line);
          if (index > -1) {
            sort.splice(index, 1);
          }
        }
      }
    }*/
  /* generating at least two X in every bet */
  // const time_to_pick_each_result = Math.round(number_of_lines_to_pick/2);
  let hash_bet_score_map = new Map<string, number>();
  let outcome_distribution_map = new Map<string, { home: number, draw: number, away: number }[]>();
  let odds_in_percentage: { home: number, draw: number, away: number }[] = [];
  for (let i = 0; i < 13; i++) {
    odds_in_percentage.push(convertOddsToIntegerPercentage(draw.events[i].odds));
  }

  for (let n = 0; n < 1; n++) {
    for (let i = 0; i < 13; i++) {
      for (let j = i + 1; j < 13; j++) {
        // for (const sign of signs) {
        const sign = 'draw';
        const line = sort.find((line: any) => line.outcomes[i] === sign && line.outcomes[j] === sign);
        const will_align = willAlignToOdds(lines_to_pick, line, hash_bet_score_map, outcome_distribution_map, odds_in_percentage);
        if (line && will_align) {
          lines_to_pick.push(line);
          const index = sort.indexOf(line);
          if (index > -1) {
            sort.splice(index, 1);
          }
        }
      }
    }
  }
  console.log(`Forced ${lines_to_pick.length} to have at least two X signs`);
  const number_of_picked_lines = lines_to_pick.length;
  let skip = 0;
  for (let i = 0; i < number_of_lines_to_pick - number_of_picked_lines; i++) {
    const startTime2 = Date.now();
    for (let index = 0; index < sort.length; index++) {
      const will_align = willAlignToOdds(lines_to_pick, sort[index], hash_bet_score_map, outcome_distribution_map, odds_in_percentage);
      console.log(`will_align: ${JSON.stringify(will_align, null, 2)}`);
      if (sort[index] && will_align) {
        const elapsedTime2 = Date.now() - startTime2;
        if (elapsedTime2 > 2) {
          console.log(`elapsedTime: ${JSON.stringify(elapsedTime2, null, 2)} ms`);
        }
        // console.log(`${JSON.stringify(i / (number_of_lines_to_pick - number_of_picked_lines), null, 2)}%`);
        if (skip > 0) {
          console.log(`skipped: ${JSON.stringify(skip, null, 2)}`);
        }
        lines_to_pick.push(sort[index]);
        sort.splice(index, 1);
        skip = 0;
        break;
      } else {
        skip++
      }
    }
  }

  return lines_to_pick;
}

const api = {
  sortOnBestOdds: function (combinations: any) {
    return combinations.sort((a: any, b: any) => {
      return a.total_odds - b.total_odds;
    });
  },
  pickBets: function (combinations: any, number_of_lines: number, draw: any) {
    return sortOnHighestBestScore(combinations, number_of_lines, draw);
  }
};

export default api;
