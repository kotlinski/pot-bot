import drawTextFormatter from "../svenskaspel/draw-text-formatter.js";
import drawCleaner from "../svenskaspel/draw-cleaner.js";
// import combinationGenerator from "../svenskaspel/combinations/generate-all-possible-combinations";
import {generateLines} from "../svenskaspel/combinations/generate-lines-combinations";
import betPicker from "../svenskaspel/combinations/draw-bet-picker";
import fs from 'fs-extra';
import {storeCleanDraw, getCurrentDraw} from "../svenskaspel/fetch/draw-store";
import draw_validator from '../svenskaspel/fetch/draw-validator';
import moment from "moment";


const os = require("os");

function getFormattedToday() {
  return moment().format('YYYYMMDDTHHmm');
}

const argv = require('optimist')
    .demand(['game_type', 'number_of_lines'])
    .argv;


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
  const a = dif / 10;
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
      console.log(appendNoOfSpaces(8 - prev.toString().length) + prev + " - " + appendNoOfSpaces(8 - parseInt(odds_dist).toString().length) + parseInt(odds_dist) + ": " + odds_distribution[odds_dist]);

      prev = parseInt(odds_dist);
    }
    //const oddsDistributionElement = odds_distribution[i];
  }
  //console.log("odds_distribution: ", JSON.stringify(odds_distribution, null, 2));
  console.log();
  console.log("max_odds: ", JSON.stringify(max_odds, null, 2));
  console.log("min_odds: ", JSON.stringify(min_odds, null, 2));
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

function niceTab(outcomes_of_game) {
  let formatted_output = "";
  for (const outcome_game of outcomes_of_game) {
    let formattedOutput = outcome_game + appendNoOfSpaces(6 - outcome_game.toString().length);
    formatted_output += formattedOutput;
  }
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
    game = parseInt(game);
    console.log();
    console.log(game + 1 + ". " + draw.events[game].description);
    console.log("      odds:  " + niceTab(Object.values(draw.events[game].odds)));
    console.log("  my distr:  " + niceTab(Object.values(outcome_distribution[game])));
    console.log("  sv. dist:  " + niceTab(Object.values(draw.events[game].distribution)));// Object.values().toString().replace(/,/g, '\t'));
    // console.log("draw.events[game]: ", JSON.stringify(draw.events[game], null, 2));
    // console.log("outcomeDistributionElement: ", JSON.stringify(outcomeDistributionElement, null, 2));
  }

}

async function printStats(bets, draw, game_type) {
  let string_to_print = `${game_type}\n`;
  let probability_of_13 = 1.0;
  console.log(JSON.stringify(bets[0], null, 2));

  for (const line of bets) {
    string_to_print += `${outcomesToPrintable(line.outcomes)}\n`;
    probability_of_13 += 1 / line.total_odds;
  }

  printOutcomeDistribution(draw, bets);
  printOddsDistribution(bets);

  let final_bets_json = bets.map(bet => bet.outcomes.map(outcome => outcomeToChar(outcome)));

  console.log('Saving file');

  await fs.outputFile(`draws/${draw.productName.toLowerCase()}/current/final.txt`, string_to_print);
  await fs.outputJSON(`draws/${draw.productName.toLowerCase()}/current/final.json`, final_bets_json, {spaces: 2});
  /*if (draw_validator.isCurrentDraw(draw)) {
  } else {
    await fs.outputFile(`draws/${draw.productName.toLowerCase()}/old/${draw.drawNumber}/analyze-ongoing/${getFormattedToday()}.txt`, string_to_print);
  }*/

  await fs.outputFile(`draws/${draw.productName.toLowerCase()}/old/${draw.drawNumber}/final.txt`, string_to_print);
  console.log();
  let turnover = drawTextFormatter.getTurnover(draw);
  console.log(`${Math.round((probability_of_13 - 1) * 1000) / 10}%`);
  console.log(`${Math.round((probability_of_13 - 1) * parseInt(draw.turnover) * 0.65 * 0.92)} SEK`);
  console.log();

  console.log(turnover);
}

async function analyzeCurrentDraw(game_type, number_of_lines) {

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
    const bets = betPicker.pickBets(combinations, number_of_lines);
    const sorted_bets = betPicker.sortOnBestOdds(bets);
    console.log(`number of bets: ${sorted_bets.length}`);

    // Skip this for now
    // await printToCSV(game_type, draw.drawNumber, combinations);

    printStats(sorted_bets, draw, game_type);

    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}

const main = async function () {
  if (!argv.game_type) {
    console.log('No game type selected, will download both stryktipset and europatipset');
    return;
  }
  if (!argv.number_of_lines) {
    console.log('How many lines to you want to bet? add param: number_of_lines');
    return;
  }
  await analyzeCurrentDraw(argv.game_type, parseInt(argv.number_of_lines), parseInt(argv.draw_number));
};


(async () => {
  await main();
})().catch(e => {
  console.log("error, " + e)
});

