import {addBetToOutcomesDistribution, Bet, calculateOutcomeDistributions} from "./analyze-draw";
import _ from "lodash";

// import sha256 from 'crypto-js/sha256';

function calculateBetScore(bets: Bet[], hash_bet_score_map: Map<string, number>, outcome_distribution_map: Map<string, { home: number, draw: number, away: number }[]>, odds_in_percentage: { home: number, draw: number, away: number }[], bet?: Bet): number {
  let bets_sha_key = JSON.stringify(bets);//sha256(JSON.stringify(bets)).toString();
  let bets_and_bet_sha_key = JSON.stringify([...bets, bet]);
  if (bet) {
    if (hash_bet_score_map.has(bets_and_bet_sha_key)) {
      return hash_bet_score_map.get(bets_and_bet_sha_key)!;
    }
  } else {
    if (hash_bet_score_map.has(bets_sha_key)) {
      return hash_bet_score_map.get(bets_sha_key)!;
    }
  }

  let outcome_distribution: { home: number, draw: number, away: number; }[] = [];
  if (outcome_distribution_map.has(bets_sha_key)) {
    outcome_distribution = outcome_distribution_map.get(bets_sha_key)!;
  } else {
    // console.log(`bets_sha_key: ${JSON.stringify(bets_sha_key, null, 2)}`);
    outcome_distribution = calculateOutcomeDistributions(bets);
    outcome_distribution_map.set(bets_sha_key, _.clone(outcome_distribution));
    // console.log(`outcome_distribution_map.size: ${JSON.stringify(outcome_distribution_map.size, null, 2)}`);
  }

  if (bet) {
    if (outcome_distribution_map.has(bets_and_bet_sha_key)) {
      outcome_distribution = outcome_distribution_map.get(bets_and_bet_sha_key)!;
    } else {
      addBetToOutcomesDistribution(bet, outcome_distribution);
      outcome_distribution_map.set(bets_and_bet_sha_key, _.clone(outcome_distribution));
    }
  }

  let compare_score = 0;
  for (let game in outcome_distribution) {
    const game_index: number = parseInt(game);
    const outcomes_of_games = {
      home: Math.round(100 * (outcome_distribution[game].home | 0) / bets.length),
      draw: Math.round(100 * (outcome_distribution[game].draw | 0) / bets.length),
      away: Math.round(100 * (outcome_distribution[game].away | 0) / bets.length)
    };
    compare_score += Math.abs(odds_in_percentage[game_index].home - outcomes_of_games.home);
    compare_score += Math.abs(odds_in_percentage[game_index].draw - outcomes_of_games.draw) * 5;
    compare_score += Math.abs(odds_in_percentage[game_index].away - outcomes_of_games.away);
  }
  if (bet) {
    hash_bet_score_map.set(bets_and_bet_sha_key, compare_score);
  } else {
    hash_bet_score_map.set(bets_sha_key, compare_score);
  }

  // console.log(`compare_score: ${JSON.stringify(compare_score, null, 2)}`);
  return compare_score;
}

export function willAlignToOdds(picked_bets: Bet[], bet: Bet, hash_bet_score_map: Map<string, number>, outcome_distribution_map: Map<string, { home: number, draw: number, away: number }[]>, odds_in_percentage: { home: number, draw: number, away: number }[]): boolean {
  if (picked_bets.length < 1) {
    return true;
  }
  if (!bet) {
    return false
  }

  const bet_score_a: number = calculateBetScore(picked_bets, hash_bet_score_map, outcome_distribution_map, odds_in_percentage);

  if (bet_score_a < 1850) {
    // console.log(`picked_bets.length: ${JSON.stringify(picked_bets.length, null, 2)}`);
    // console.log(`bet_score_a: ${JSON.stringify(bet_score_a, null, 2)}`);
    return true;
  }
  const bet_score_b: number = calculateBetScore([...picked_bets, bet], hash_bet_score_map, outcome_distribution_map, odds_in_percentage);
  const value = bet_score_a > (bet_score_b + 4);
  console.log(`value: ${JSON.stringify(value, null, 2)}`);
  if (value) {
    console.log(`bet_score_b: ${JSON.stringify(bet_score_b, null, 2)}`);
  }
  return value;
}
