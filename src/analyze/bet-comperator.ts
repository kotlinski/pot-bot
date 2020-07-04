import {Bet, calculateOutcomeDistributions} from "./analyze-draw";
import {convertOddsToIntegerPercentage} from "../svenskaspel/bet-calculations/percentage-converter";


function calculateBetScore(bets: Bet[], draw: any) {
  const outcome_distribution = calculateOutcomeDistributions(bets);

  let compare_score = 0;
  for (let game in outcome_distribution) {
    const game_index: number = parseInt(game);
    let odds_in_percentage = convertOddsToIntegerPercentage(draw.events[game_index].odds);
    const outcomes_of_games = {
      home: Math.round(100 * (outcome_distribution[game].home|0) / bets.length),
      draw: Math.round(100 * (outcome_distribution[game].draw|0) / bets.length),
      away: Math.round(100 * (outcome_distribution[game].away|0) / bets.length)
    };
    compare_score += Math.abs(odds_in_percentage.home - outcomes_of_games.home);
    compare_score += Math.abs(odds_in_percentage.draw - outcomes_of_games.draw)*5;
    compare_score += Math.abs(odds_in_percentage.away - outcomes_of_games.away);
  }
  return compare_score;
}

export function willAlignToOdds(picked_bets: Bet[], bet: Bet, draw: any): boolean {
  if (picked_bets.length < 1) {
    return true;
  }
  if (!bet) {
    return false
  }
  const bet_score_a: number = calculateBetScore([...picked_bets], draw);
  const bet_score_b: number = calculateBetScore([...picked_bets, bet], draw);
  console.log(`bet_score_a: ${JSON.stringify(bet_score_a, null, 2)}`);
  return bet_score_a > bet_score_b+100;
}
