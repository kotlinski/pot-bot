import {getCurrentDraw, getFinalBets} from "../svenskaspel/fetch/draw-store";
import drawCleaner from "../svenskaspel/draw-cleaner";

interface CorrectCount {
  possible_no_of_corrects: number,
  odds_to_be_fulfilled: number,
  signs_to_beg_for: string[]
}

export interface AggregatedNoOfCorrects {
  count: number,
  odds: number,
  signs: string[][],
}

export async function verifyBetsWithCurrentResults(game_type: string, correct_results: string[], file_name: string) {
  console.log("Reading current draw...");
  let bets;
  try {
    bets = await getFinalBets(game_type, file_name);
  } catch (error) {
    console.log('Could not read current draw, please fetch again `npm run fetch-current-draw`', error)
  }
  return await verifyBetsWithResults(game_type, correct_results, bets);
}

export const verifyBetsWithResults = async (game_type: string, correct_results: string[], bets: string[][]): Promise<number> => {
  let clean_draw: any;
  try {
    const draw = await getCurrentDraw(game_type);
    clean_draw = drawCleaner.massageData(draw);
  } catch (error) {
    console.log('Could not read current draw, please fetch again `npm run fetch-current-draw`', error)
  }
  try {
    console.log("bets.length: ", JSON.stringify(bets.length, null, 2));
    let correct_count: CorrectCount[] = [];
    for (let i = 0; i < correct_results.length; i++) {
      let correct_char = correct_results[i];

      console.log(i + 1 + ". " + correct_char);
      for (let bet_index = 0; bet_index < bets.length; bet_index++) {
        if (correct_count[bet_index] === undefined) {
          correct_count[bet_index] = {
            possible_no_of_corrects: 0,
            odds_to_be_fulfilled: 1.0,
            signs_to_beg_for: []
          };
        }
        if (bets[bet_index][i] === correct_char || correct_char === '*') {
          correct_count[bet_index].possible_no_of_corrects += 1;
        }
        if (correct_char === '*') {
          ////
          let sign = 'home';
          if (bets[bet_index][i] === 'X') {
            sign = 'draw'
          }
          if (bets[bet_index][i] === '2') {
            sign = 'away'
          }
          correct_count[bet_index].odds_to_be_fulfilled *= clean_draw.events[i][sign].odds_in_percentage;
          correct_count[bet_index].signs_to_beg_for.push(sign);
        }
      }
    }
    correct_count = correct_count.filter(coupon => coupon.possible_no_of_corrects >= 10);

    let maximum_possible_no_of_corrects = 0;
    correct_count.forEach(coupon => {
      maximum_possible_no_of_corrects = Math.max(maximum_possible_no_of_corrects, coupon.possible_no_of_corrects);
    });
    console.log("maximum_possible_no_of_corrects: ", JSON.stringify(maximum_possible_no_of_corrects, null, 2));
    let aggregated_values: AggregatedNoOfCorrects[] = [];
    correct_count.forEach(coupon => {
      if (aggregated_values[coupon.possible_no_of_corrects] == null) {
        aggregated_values[coupon.possible_no_of_corrects] = {
          count: 0,
          odds: 0,
          signs: []
        }
      }
      if (coupon.possible_no_of_corrects === maximum_possible_no_of_corrects) {
        aggregated_values[coupon.possible_no_of_corrects].signs.push(coupon.signs_to_beg_for);
      }
      aggregated_values[coupon.possible_no_of_corrects] = {
        count: (aggregated_values[coupon.possible_no_of_corrects].count) + 1,
        odds: (aggregated_values[coupon.possible_no_of_corrects].odds) + coupon.odds_to_be_fulfilled,
        signs: aggregated_values[coupon.possible_no_of_corrects].signs
      };
    });

    let max = 0;
    for (let coupon in aggregated_values) {
      max = (max < parseFloat(coupon)) ? parseFloat(coupon) : max;
    }


    const number_of_unknowns = (correct_results.filter(sign => sign === "*").length);
    let signs_dist: any = {};
    for (const aggregated_value of aggregated_values[max].signs) {
      for (let i = 0; i < number_of_unknowns; i++) {
        if (signs_dist[i] === undefined) {
          signs_dist[i] = {
            home: 0,
            draw: 0,
            away: 0
          }
        }
        signs_dist[i][aggregated_value[i]] += 1;
      }

    }
    const nice_lines = aggregated_values[max].signs;
    aggregated_values[max].signs = signs_dist;
    console.log("signs_dist: ", JSON.stringify(nice_lines, null, 2));

    for (const index of [10, 11, 12, 13]) {
      console.log(`${index}: ${JSON.stringify(aggregated_values[index], null, 2)}`);
    }
    console.log('success!');
    return maximum_possible_no_of_corrects;
  } catch (err) {
    console.log(`err: ${JSON.stringify(err, null, 2)}`);
    return 0;
  }

};
