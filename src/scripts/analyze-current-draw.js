import drawTextFormatter from "../svenskaspel/draw-text-formatter.js";
import drawCleaner from "../svenskaspel/draw-cleaner.js";
// import combinationGenerator from "../svenskaspel/combinations/generate-all-possible-combinations";
import {generateLines} from "../svenskaspel/combinations/generate-lines-combinations";
import betPicker from "../svenskaspel/combinations/draw-bet-picker";
import fs from 'fs-extra';
import {storeCleanDraw, getCurrentDraw} from "../svenskaspel/fetch/draw-store";

const os = require("os");


const argv = require('optimist')
    .demand(['game_type'])
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

async function printStats(bets, draw, game_type) {
  let string_to_print = `${game_type}\n`;
  let probability_of_13 = 1.0;
  console.log(JSON.stringify(bets[0], null, 2));
  for (const line of bets) {
    // console.log("bets: ", JSON.stringify(bets, null, 2));
    string_to_print += `${outcomesToPrintable(line.outcomes)}\n`;
    console.log("line.outcomes: ", JSON.stringify(outcomesToPrintable(line.outcomes), null, 2));
    console.log("odds: ", line.total_odds);
    console.log("bet_score: ", line.bet_score);
    console.log(" --- ");
    probability_of_13 += line.odds_rate;
  }
  console.log('Saving file');
  await fs.outputFile(`draws/${draw.productName.toLowerCase()}/current/final.txt`, string_to_print);
  console.log();
  let turnover = drawTextFormatter.getTurnover(draw);
  console.log(`${Math.round((probability_of_13 - 1) * 1000) / 10}%`);
  console.log(`${Math.round((probability_of_13 - 1) * parseInt(draw.turnover) * 0.65 * 0.92)} SEK`);
  console.log(turnover);
}

async function analyzeCurrentDraw(game_type) {

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
    const bets = betPicker.pickBets(combinations);
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
  await analyzeCurrentDraw(argv.game_type, parseInt(argv.draw_number));
};


(async () => {
  await main();
})().catch(e => {
  console.log("error, " + e)
});

