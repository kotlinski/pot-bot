import {willAlignToOdds} from "../../analyze/bet-comperator";


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
  for (let n = 0; n < 1; n++) {
    for (let i = 0; i < 13; i++) {
      for (let j = i + 1; j < 13; j++) {
        // for (const sign of signs) {
        const sign = 'draw';
        const line = sort.find((line: any) => line.outcomes[i] === sign && line.outcomes[j] === sign);
        const will_align = willAlignToOdds(lines_to_pick, line, draw);
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
  for (let i = 0; i < number_of_lines_to_pick - number_of_picked_lines; i++) {
    lines_to_pick.push(sort[i]);
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

/*    for (let i = 0; i < 1.05; i += 0.1) {
      i = Math.round(i * 100) / 100;
      const sort = combinations.sort((a, b) => {
        return calculateSortScore(b, i) - calculateSortScore(a, i);
      });
      for (let i = 0; i < 10; i++) {
        lines_to_pick.push(sort[i]);
      }
      combinations = combinations.filter((el) => !lines_to_pick.includes(el));
    }*/
