import fs from "fs-extra";
import {convertOddsToIntegerPercentage} from "../svenskaspel/bet-calculations/percentage-converter";

import {getCurrentDraw} from "../svenskaspel/fetch/draw-store";

import {generateLines} from "../svenskaspel/combinations/generate-lines-combinations";
import betPicker from "../svenskaspel/combinations/draw-bet-picker";
import drawTextFormatter from "../svenskaspel/draw-text-formatter.js";
import drawCleaner from "../svenskaspel/draw-cleaner.js";
import moment from "moment";

require('colors');

const os = require("os");

function getFormattedToday() {
  return moment().format('YYYYMMDDTHHmm');
}

async function printToCSV(game_type, draw_number, combinations) {
  console.log("combinations: ", JSON.stringify(combinations, null, 2));
  let combinations_string = combinations.map(combination => {
    return `${combination.id},${combination.odds_rate.toFixed(4)},${combination.bet_value_rate.toFixed(4)},${combination.score}${os.EOL}`;
  });
  let combinations_string_return = "id, 'odds rate', 'value rate', score" + os.EOL + combinations_string.join('');
  await fs.outputFile(`draws/${game_type}/old/${draw_number}/combinations.csv`, combinations_string_return);
}

function outcomeToChar(outcome) {
  if (outcome === "home") {
    return '1';
  } else if (outcome === "draw") {
    return 'X'
  }
  return "2";

}

function outcomesToPrintable(outcomes) {
  let printable = "E";
  outcomes.forEach(outcome => {
    printable += ',' + outcomeToChar(outcome);
  });
  return printable;
}

function printOddsDistribution(bets) {
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
  const odds_distribution = {};

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
  for (let [odds_dist, value] of Object.entries(odds_distribution)) {
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

function printNumberOfPersonsWithThisBet(draw, bets) {
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
  const distribution = {};

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
  for (let [odds_dist, value] of Object.entries(distribution)) {
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

const times = x => f => {
  if (x > 0) {
    f();
    times(x - 1)(f)
  }
};

function appendNoOfSpaces(number) {
  let spaces = "";
  times(number)(() => spaces += " ");
  return spaces;
}

function niceTab(outcomes_of_game, comparable) {
  let formatted_output = "";
  outcomes_of_game.forEach((outcome_game, index) => {
    let outcome_string_length = outcome_game.toString().length;
    if (comparable) {
      let diff = outcome_game - Object.values(comparable)[index];
      if (diff < 0) {
        outcome_string_length = `${outcome_game} ${diff}`.length;
        outcome_game = `${outcome_game} ${diff}`.green;
      } else if (diff > 0) {
        outcome_string_length = `${outcome_game} +${diff}`.length;
        outcome_game = `${outcome_game} +${diff}`.red;
      }
    }
    let formattedOutput = outcome_game + appendNoOfSpaces(8 - outcome_string_length);
    formatted_output += formattedOutput;
  });
  return formatted_output;
}

function printOutcomeDistribution(draw, bets) {
  let outcome_distribution = {};
  for (const line of bets) {
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

  for (let game in outcome_distribution) {
    const outcomes_of_games = [
      Math.round(100 * outcome_distribution[game].home / bets.length),
      Math.round(100 * outcome_distribution[game].draw / bets.length),
      Math.round(100 * outcome_distribution[game].away / bets.length)
    ];

    game = parseInt(game);
    let odds_in_percentage = convertOddsToIntegerPercentage(draw.events[game].odds);
    console.log();
    console.log(game + 1 + ". " + draw.events[game].description);
    console.log("      odds:  " + niceTab(Object.values(draw.events[game].odds)));
    console.log("    odds %:  " + niceTab(Object.values(odds_in_percentage)));
    console.log("  sv. dist:  " + niceTab(Object.values(draw.events[game].distribution), odds_in_percentage));// Object.values().toString().replace(/,/g, '\t'));
    console.log("  my distr:  " + niceTab(outcomes_of_games));

    // console.log("draw.events[game]: ", JSON.stringify(draw.events[game], null, 2));
    // console.log("outcomeDistributionElement: ", JSON.stringify(outcomeDistributionElement, null, 2));
  }

}


function print1X2Distribution(string_to_print, bets) {
  const no_of_x = (string_to_print.match(/X/g) || []).length;
  const no_of_1 = (string_to_print.match(/1/g) || []).length;
  const no_of_2 = (string_to_print.match(/2/g) || []).length;
  console.log("1,X,2 distributions");
  console.log(`1: ${no_of_1},${appendNoOfSpaces(4 - no_of_1.toString().length)} ~${(no_of_1 / bets.length).toFixed(2)} per line`);
  console.log(`X: ${no_of_x},${appendNoOfSpaces(4 - no_of_x.toString().length)} ~${(no_of_x / bets.length).toFixed(2)} per line`);
  console.log(`2: ${no_of_2},${appendNoOfSpaces(4 - no_of_2.toString().length)} ~${(no_of_2 / bets.length).toFixed(2)} per line`);
}

async function printStats(bets, draw, game_type) {
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

  await fs.outputFile(`draws/${draw.productName.toLowerCase()}/current/final.txt`, string_to_print);
  await fs.outputJSON(`draws/${draw.productName.toLowerCase()}/current/final.json`, final_bets_json, {spaces: 2});

  await fs.outputFile(`draws/${draw.productName.toLowerCase()}/old/${draw.drawNumber}/final.txt`, string_to_print);
  console.log();
  let turnover = drawTextFormatter.getTurnover(draw);
  console.log(`${Math.round((probability_of_13 - 1) * 1000) / 10}%`);
  let WIN_QUOTA = 0.65;
  let SVENSKA_SPEL_TURNOVER_QUOTA = 0.92;
  console.log(`${Math.round((probability_of_13 - 1) * parseInt(draw.turnover) * WIN_QUOTA * SVENSKA_SPEL_TURNOVER_QUOTA)} SEK`);
  console.log();

  console.log(turnover);
}

export async function analyzeCurrentDraw(game_type, number_of_lines_to_generate) {

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
    const bets = betPicker.pickBets(combinations, number_of_lines_to_generate);
    const sorted_bets = betPicker.sortOnBestOdds(bets);
    console.log(`sorted_bets.length: ${JSON.stringify(sorted_bets.length, null, 2)}`);
    const final_bet = sorted_bets.slice(0, number_of_lines_to_generate);
    console.log(`number of bets: ${final_bet.length}`);

    // Skip this for now
    // await printToCSV(game_type, draw.drawNumber, combinations);

    printStats(final_bet, draw, game_type);

    console.log('success!');
    return `draws/${draw.productName.toLowerCase()}/current/final.txt`;
  } catch (err) {
    console.error(err);
    return err;
  }
}
