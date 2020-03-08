import drawTextFormatter from "../svenskaspel/draw-text-formatter.js";
import drawCleaner from "../svenskaspel/draw-cleaner.js";
import combinationGenerator from "../svenskaspel/combinations/generate-all-possible-combinations";
import betPicker from "../svenskaspel/combinations/draw-bet-picker";
import fs from 'fs-extra';
import {storeCleanDraw, getCurrentDraw} from "../svenskaspel/fetch/draw-store";

const os = require("os");


const argv = require('optimist')
    .demand(['game_type'])
    .argv;


async function printToCSV(game_type, draw_number, combinations) {
  let combinations_string = combinations.map(combination => {
    return `${combination.id},${combination.odds_rate.toFixed(4)},${combination.bet_value_rate.toFixed(4)},${combination.score}${os.EOL}`;
  });
  let combinations_string_return = "id, 'odds rate', 'value rate', score" + os.EOL + combinations_string.join('');
  await fs.outputFile(`draws/${game_type}/old/${draw_number}/combinations.csv`, combinations_string_return);
}

function printStats(bets, draw) {
  let string_to_print = "Stryktipset\n";
  let probability_of_13 = 1;
  for (const line of bets) {
    string_to_print += `${line.id}\n`;
    console.log(line.id);
    probability_of_13 += line.odds_rate;
  }
  console.log('Saving file');
  // await fs.outputFile(`draws/${game_type}/old/${draw_number}/final.txt`, string_to_print);
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
    draw = getCurrentDraw(game_type);
  } catch (error) {
    console.log('Could not read current draw, please fetch again `npm run fetch-current-draw`', error)
  }
  try {
    let clean_draw = drawCleaner.massageData(draw);
    // await storeCleanDraw(game_type, clean_draw);

    const combinations = combinationGenerator.generateAllCombinations(clean_draw);

    const bets = betPicker.pickBets(combinations);

    await printToCSV(game_type, draw_number, combinations);

    printStats(bets, draw);

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

