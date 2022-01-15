/*
import { willAlignToOdds } from '../../analyze/bet-comperator';
import { convertToPercentage } from '../bet-calculations/percentage-converter';
import { calculateOutcomeDistributions } from '../../analyze/analyze-draw';
import ProgressBar from 'progress';
import { DrawConfig } from '../../analyze/draw-config';
import { Bet, BetIndexSign, Outcome } from '../interfaces';

// const ProgressBar = require('progress');

function findResultsToFocusOn(
  _draw_config: DrawConfig,
  sorted_possible_combinations: Bet[],
  odds_in_percentage: { home: number; draw: number; away: number }[],
  picked_lines: Bet[],
  _filter_roughness: number,
): Bet[] {
  const outcome_distribution = calculateOutcomeDistributions(picked_lines);

  const bet_indexes: BetIndexSign[] = [];
  for (let game_index = 0; game_index < outcome_distribution.length; game_index++) {
    const outcomes_of_games = {
      home: Math.round(((outcome_distribution[game_index].home || 0) / picked_lines.length) * 10000) / 10000,
      draw: Math.round(((outcome_distribution[game_index].draw || 0) / picked_lines.length) * 10000) / 10000,
      away: Math.round(((outcome_distribution[game_index].away || 0) / picked_lines.length) * 10000) / 10000,
    };
    let sign: Outcome = Outcome.HOME;
    const compare_score_home = odds_in_percentage[game_index].home - outcomes_of_games.home;
    const compare_score_draw = odds_in_percentage[game_index].draw - outcomes_of_games.draw;
    const compare_score_away = odds_in_percentage[game_index].away - outcomes_of_games.away;
    const highest_diff = Math.max(compare_score_away, compare_score_draw, compare_score_home);

    if (compare_score_home === highest_diff) {
      sign = Outcome.HOME;
    } else if (compare_score_draw === highest_diff) {
      sign = Outcome.DRAW;
    } else if (compare_score_away === highest_diff) {
      sign = Outcome.AWAY;
    }

    bet_indexes.push({ index: game_index, sign, rate: highest_diff });
  }

  const sorted_bet_indexes = bet_indexes.sort((bet_index_a, bet_index_b) => bet_index_b.rate - bet_index_a.rate);
  // const top_bets = sorted_bet_indexes.slice(0, draw_config.number_of_focused_bets_to_align - filter_roughness);

  // console.log(`top_bets: ${JSON.stringify(top_bets, null, 2)}`);
  // console.log(`sorted_possible_combinations length before: ${JSON.stringify(sorted_possible_combinations.length, null, 2)}`);
  // console.log(`sorted_possible_combinations after before: ${JSON.stringify(filtered_bet_combinations.length, null, 2)}`);
  // console.log(`filtered_bet_combinations[0]: ${JSON.stringify(filtered_bet_combinations[0], null, 2)}`);

  return sorted_possible_combinations.filter((bet) => {
    for (const top_bet of sorted_bet_indexes) {
      if (bet.outcomes[top_bet.index] !== top_bet.sign) {
        return false;
      }
    }
    return true;
  });
}

function sortOnHighestBestScore(draw_config: DrawConfig, combinations: any, draw: any) {
  const lines_to_pick = [];

  const sorted_possible_combinations = combinations.sort(
    (a: any, b: any) =>
      // opposite b to a if doing a.total_odds / getting lowest odds as possible
      b.bet_score - a.bet_score,
  );

  const hash_bet_score_map = new Map<string, number>();
  const outcome_distribution_map = new Map<string, { home: number; draw: number; away: number }[]>();
  const odds_in_percentage: { home: number; draw: number; away: number }[] = [];
  for (let i = 0; i < 13; i++) {
    odds_in_percentage.push(convertToPercentage(draw.events[i].odds));
  }

  for (let n = 0; n < 1; n++) {
    for (let i = 0; i < 13; i++) {
      for (let j = i + 1; j < 13; j++) {
        // for (const sign of signs) {
        const sign = 'draw';
        const line = sorted_possible_combinations.find((line: any) => line.outcomes[i] === sign && line.outcomes[j] === sign);
        const will_align = willAlignToOdds(
          lines_to_pick,
          line,
          hash_bet_score_map,
          outcome_distribution_map,
          odds_in_percentage,
        );
        if (line && will_align) {
          lines_to_pick.push(line);
          const index = sorted_possible_combinations.indexOf(line);
          if (index > -1) {
            sorted_possible_combinations.splice(index, 1);
          }
        }
      }
    }
  }
  console.log(`Forced ${lines_to_pick.length} to have at least two X signs`);
  const number_of_picked_lines = lines_to_pick.length;
  // let skip = 0;
  let highest_index = 0;
  //  for (let i = 0; i < number_of_lines_to_pick - number_of_picked_lines; i++) {
  let loop_without_diff = 0;
  let last_lenght = 0;
  const bar = new ProgressBar(':bar :percent :etas', {
    total: draw_config.number_of_lines_to_pick - lines_to_pick.length,
    width: 32,
  });

  while (lines_to_pick.length < draw_config.number_of_lines_to_pick) {
    if (last_lenght === lines_to_pick.length) {
      loop_without_diff++;
      console.log(`loop_without_diff: ${JSON.stringify(loop_without_diff, null, 2)}`);
    } else {
      bar.tick();
      if (bar.complete) {
        console.log('\ncomplete\n');
      }
    }

    last_lenght = lines_to_pick.length;

    // const startTime2 = Date.now();
    const focus_on_lines = findResultsToFocusOn(
      draw_config,
      sorted_possible_combinations,
      odds_in_percentage,
      lines_to_pick,
      loop_without_diff,
    );

    for (let index = 0; index < focus_on_lines.length; index++) {
      const will_align = willAlignToOdds(
        lines_to_pick,
        focus_on_lines[index],
        hash_bet_score_map,
        outcome_distribution_map,
        odds_in_percentage,
      );
      const bet = focus_on_lines[index];

      const find_index: number = sorted_possible_combinations.indexOf(bet);
      if (sorted_possible_combinations[find_index] && will_align) {
        // console.log(`index: ${JSON.stringify(find_index, null, 2)}`);
        highest_index = Math.max(find_index, highest_index);
        // console.log(`heighest_index: ${JSON.stringify(highest_index, null, 2)}`);
        lines_to_pick.push(sorted_possible_combinations[find_index]);
        sorted_possible_combinations.splice(find_index, 1);
        // console.log(`skiped: ${JSON.stringify(skip, null, 2)}`);
        //       skip = 0;
        break;
      } else {
        //      skip++
      }
    }
  }

  console.log(
    `number_of_lines_to_pick - number_of_picked_lines: ${JSON.stringify(
      draw_config.number_of_lines_to_pick - number_of_picked_lines,
      null,
      2,
    )}`,
  );
  return lines_to_pick;
}

const api = {
  sortOnBestOdds(combinations: any) {
    return combinations.sort((a: any, b: any) => a.total_odds - b.total_odds);
  },
  pickBets(draw_config: DrawConfig, combinations: any, draw: any) {
    return sortOnHighestBestScore(draw_config, combinations, draw);
  },
};

export default api;
*/
