import {outputFile, outputJSON} from "fs-extra";
import {convertOddsToIntegerPercentage} from "../svenskaspel/bet-calculations/percentage-converter";

import {getCurrentDraw} from "../svenskaspel/fetch/draw-store";

import {generateLines} from "../svenskaspel/combinations/generate-lines-combinations";
import betPicker from "../svenskaspel/combinations/draw-bet-picker";
import drawTextFormatter from "../svenskaspel/draw-text-formatter.js";
import drawCleaner from "../svenskaspel/draw-cleaner.js";

require('colors');

export enum Outcome {
  home = 'home',
  draw = 'draw',
  away = 'away',
}

function outcomeToChar(outcome: Outcome) {
  if (outcome === Outcome.home) {
    return '1';
  } else if (outcome === Outcome.draw) {
    return 'X'
  }
  return "2";

}

function outcomesToPrintable(outcomes: Outcome[]) {
  let printable = "E";
  outcomes.forEach((outcome: Outcome) => {
    printable += ',' + outcomeToChar(outcome);
  });
  return printable;
}

export interface Bet {
  total_odds: number;
  outcomes: Outcome[];
}

function printOddsDistribution(bets: Bet[]) {
  let min_odds = 200000000;
  let max_odds = 0;
  for (const line of bets) {
    if (min_odds > line.total_odds) {
      min_odds = line.total_odds
    }
    if (max_odds < line.total_odds) {
      max_odds = line.total_odds
    }
  }

  const dif = max_odds - min_odds;
  let segments = 15;
  const a = dif / segments;
  const odds_distribution: any = {};

  for (const line of bets) {
    for (let i = min_odds; i <= max_odds; i = i + a) {
      if (odds_distribution[i] == null) {
        odds_distribution[i] = 0;
      }
      if (line.total_odds < i) {
        odds_distribution[i] += 1;
        break;
      }
    }
  }
  console.log();
  let prev = null;
  for (let [odds_dist] of Object.entries(odds_distribution)) {
    if (prev === null) {
      prev = parseInt(odds_dist);
    } else {
      console.log(appendNoOfSpaces(8 - prev.toString().length) + prev + " - " + appendNoOfSpaces(6 - parseInt(odds_dist).toString().length) + parseInt(odds_dist) + ": " + odds_distribution[odds_dist]);

      prev = parseInt(odds_dist);
    }
  }
  console.log();
  console.log("min_odds: 1:", Math.round(min_odds));
  console.log("max_odds: 1:", Math.round(max_odds));
  console.log();
}

function printNumberOfPersonsWithThisBet(draw: any, bets: Bet[]) {
  console.log("printNumberOfPersonsWithThisBet");
  const no_of_lines_with_bet = [];
  for (const line of bets) {
    let distribution = 1;
    line.outcomes.forEach((outcome, index) => {
      distribution *= draw.events[index].distribution[outcome] * 0.01
    });
    no_of_lines_with_bet.push(Math.round(distribution * parseInt(draw.turnover)));
  }
  let min_no_of_lines = Math.min(...no_of_lines_with_bet);
  let max_no_of_lines = Math.max(...no_of_lines_with_bet);

  console.log("min_no_of_lines: ", JSON.stringify(min_no_of_lines, null, 2));
  console.log("max_no_of_lines: ", JSON.stringify(max_no_of_lines, null, 2));
  const dif = max_no_of_lines - min_no_of_lines;
  let segments = 15;
  const a = dif / segments;
  const distribution: any = {};

  for (const line of no_of_lines_with_bet) {
    for (let i = min_no_of_lines; i <= max_no_of_lines + 100; i = Math.ceil(i + a)) {
      /* console.log("line: ", JSON.stringify(line, null, 2));
       console.log("i: ", JSON.stringify(i, null, 2));
       console.log("i+a: ", JSON.stringify(i+a, null, 2));*/
      if (distribution[i] == null) {
        distribution[i] = 0;
      }
      if (line < i) {
        distribution[i] += 1;
        break;
      }
    }
  }
  console.log();
  let prev = null;
  for (let [odds_dist] of Object.entries(distribution)) {
    if (prev === null) {
      prev = parseInt(odds_dist);
    } else {
      console.log(appendNoOfSpaces(8 - prev.toString().length) + prev + " - " + appendNoOfSpaces(6 - parseInt(odds_dist).toString().length) + parseInt(odds_dist) + ": " + distribution[odds_dist]);

      prev = parseInt(odds_dist);
    }
  }
  console.log();
  const money_to_win = parseInt(draw.turnover) * 0.65 * 0.39;
  const sek_formatter = new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  });
  console.log(`Max 1:${Math.round(max_no_of_lines)},${appendNoOfSpaces(4 - max_no_of_lines.toString().length)} ~${sek_formatter.format(Math.round(money_to_win / max_no_of_lines))}`);
  console.log(`Min 1:${Math.round(min_no_of_lines)},${appendNoOfSpaces(4 - min_no_of_lines.toString().length)} ~${sek_formatter.format(Math.round(money_to_win / min_no_of_lines))}`);
  console.log();
}

const times = (x: number) => (f: any) => {
  if (x > 0) {
    f();
    times(x - 1)(f)
  }
};

function appendNoOfSpaces(number: number) {
  let spaces = "";
  times(number)(() => spaces += " ");
  return spaces;
}

function niceTab(outcomes_of_game: any[], comparable?: { home: number; draw: number; away: number; }) {
  let formatted_output = "";
  outcomes_of_game.forEach((outcome_game, index) => {
    let outcome_string_length = outcome_game.toString().length;
    if (comparable) {
      let diff = outcome_game - Object.values(comparable)[index];
      if (diff < 0) {
        outcome_string_length = `${outcome_game} ${diff}`.length;
        outcome_game = `${outcome_game} ${diff}`;
      } else if (diff > 0) {
        outcome_string_length = `${outcome_game} +${diff}`.length;
        outcome_game = `${outcome_game} +${diff}`;
      }
    }
    let formattedOutput = outcome_game + appendNoOfSpaces(8 - outcome_string_length);
    formatted_output += formattedOutput;
  });
  return formatted_output;
}

export function calculateOutcomeDistributions(bets: Bet[]): any {
  let outcome_distribution: any = {};
  for (const line of bets) {
    if (!line) {
      console.log("line is undefined");
      console.log(`bets: ${JSON.stringify(bets, null, 2)}`);
    }
    for (let i = 0; i < line.outcomes.length; i++) {
      const outcome = line.outcomes[i];
      if (outcome_distribution[i] == null) {
        outcome_distribution[i] = {};
      }
      if (outcome_distribution[i][outcome] == null) {
        outcome_distribution[i][outcome] = 0;
      }
      outcome_distribution[i][outcome] += 1;
    }
  }
  return outcome_distribution;
}

function printOutcomeDistribution(draw: any, bets: Bet[]) {
  const outcome_distribution = calculateOutcomeDistributions(bets);

  for (let game in outcome_distribution) {
    const outcomes_of_games = [
      Math.round(100 * outcome_distribution[game].home / bets.length),
      Math.round(100 * outcome_distribution[game].draw / bets.length),
      Math.round(100 * outcome_distribution[game].away / bets.length)
    ];

    const game_index: number = parseInt(game);
    let odds_in_percentage = convertOddsToIntegerPercentage(draw.events[game_index].odds);
    console.log();
    console.log((game_index + 1) + ". " + draw.events[game_index].description);
    console.log("      odds:  " + niceTab(Object.values(draw.events[game_index].odds)));
    console.log("    odds %:  " + niceTab(Object.values(odds_in_percentage)));
    console.log("  sv. dist:  " + niceTab(Object.values(draw.events[game_index].distribution), odds_in_percentage));// Object.values().toString().replace(/,/g, '\t'));
    console.log("  my distr:  " + niceTab(outcomes_of_games));

    // console.log("draw.events[game]: ", JSON.stringify(draw.events[game], null, 2));
    // console.log("outcomeDistributionElement: ", JSON.stringify(outcomeDistributionElement, null, 2));
  }

}


function print1X2Distribution(string_to_print: string, bets: Bet[]) {
  const no_of_x = (string_to_print.match(/X/g) || []).length;
  const no_of_1 = (string_to_print.match(/1/g) || []).length;
  const no_of_2 = (string_to_print.match(/2/g) || []).length;
  console.log("1,X,2 distributions");
  console.log(`1: ${no_of_1},${appendNoOfSpaces(4 - no_of_1.toString().length)} ~${(no_of_1 / bets.length).toFixed(2)} per line`);
  console.log(`X: ${no_of_x},${appendNoOfSpaces(4 - no_of_x.toString().length)} ~${(no_of_x / bets.length).toFixed(2)} per line`);
  console.log(`2: ${no_of_2},${appendNoOfSpaces(4 - no_of_2.toString().length)} ~${(no_of_2 / bets.length).toFixed(2)} per line`);
}

async function printStats(bets: Bet[], draw: any, game_type: string) {
  let string_to_print = `${game_type}\n`;
  let probability_of_13 = 1.0;
//   console.log(JSON.stringify(bets[0], null, 2));

  for (const line of bets) {
    string_to_print += `${outcomesToPrintable(line.outcomes)}\n`;
    probability_of_13 += 1 / line.total_odds;
  }

  printOutcomeDistribution(draw, bets);
  printOddsDistribution(bets);
  printNumberOfPersonsWithThisBet(draw, bets);

  let final_bets_json = bets.map(bet => bet.outcomes.map(outcome => outcomeToChar(outcome)));
  print1X2Distribution(string_to_print, bets);

  console.log(`${bets.length} lines added to your export`);

  console.log('Saving file');

  await outputFile(`draws/${draw.productName.toLowerCase()}/current/final.txt`, string_to_print);
  await outputJSON(`draws/${draw.productName.toLowerCase()}/current/final.json`, final_bets_json, {spaces: 2});

  await outputFile(`draws/${draw.productName.toLowerCase()}/old/${draw.drawNumber}/final.txt`, string_to_print);
  console.log();
  let turnover = drawTextFormatter.getTurnover(draw);
  console.log(`${Math.round((probability_of_13 - 1) * 1000) / 10}%`);
  let WIN_QUOTA = 0.65;
  let SVENSKA_SPEL_TURNOVER_QUOTA = 0.92;
  console.log(`${Math.round((probability_of_13 - 1) * parseInt(draw.turnover) * WIN_QUOTA * SVENSKA_SPEL_TURNOVER_QUOTA)} SEK`);
  console.log();

  console.log(turnover);
  return string_to_print;
}

export async function analyzeCurrentDraw(game_type: string, number_of_lines_to_generate: number) {
  console.log("Reading current draw...");
  let draw;
  try {
    draw = await getCurrentDraw(game_type);
  } catch (error) {
    console.log('Could not read current draw, please fetch again `npm run fetch-current-draw`', error)
  }
  try {
    let clean_draw = drawCleaner.massageData(draw);
    // await storeCleanDraw(game_type, clean_draw);

    const combinations = generateLines(clean_draw.events);

    console.log(`number of combinations: ${combinations.length}`);

    const bets = betPicker.pickBets(combinations, number_of_lines_to_generate, draw);

    const sorted_bets = betPicker.sortOnBestOdds(bets);
    console.log(`sorted_bets.length: ${JSON.stringify(sorted_bets.length, null, 2)}`);
    const final_bet = sorted_bets.slice(0, number_of_lines_to_generate);
    console.log(`number of bets: ${final_bet.length}`);

    // Skip this for now
    // await printToCSV(game_type, draw.drawNumber, combinations);

    const string_to_print = printStats(final_bet, draw, game_type);

    console.log('success!');
    return string_to_print;
  } catch (err) {
    console.error(err);
    return err;
  }
}
