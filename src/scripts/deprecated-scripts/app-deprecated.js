import draw_fetcher from "./../svenskaspel/fetch/draw-fetcher.ts";
import drawTextFormatter from "./../svenskaspel/draw-text-formatter.ts";
import drawCleaner from "./../svenskaspel/draw-cleaner.ts";
import draw_validator from "./../svenskaspel/fetch/draw-validator.ts";
import combinationGenerator from "../svenskaspel/combinations/generate-all-possible-combinations";
import betPicker from "./../svenskaspel/combinations/draw-bet-picker";
import fs from 'fs-extra';
import {storeCleanDraw} from "./../svenskaspel/fetch/draw-store";


async function fetchDraw(game_type) {
  console.log("Fetching next draw");
  let draw = await draw_fetcher.fetchNextDraw(game_type);
  if (!draw || !draw_validator.hasOdds(draw)) {
    console.log("Can't compute upcoming draw");
    return;
  }
  try {
    let clean_draw = drawCleaner.massageData(draw);
    await storeCleanDraw(game_type, clean_draw);
    const combinations = combinationGenerator.generateAllCombinations(clean_draw);
    const bets = betPicker.pickBets(combinations);

    let string_to_print = "Stryktipset\n";
    let probability_of_13 = 1;
    for (const line of bets) {
      string_to_print += `${line.id}\n`;
      console.log(line.id);
      probability_of_13 += line.odds_rate;
    }
    console.log('Saving file');
    await fs.outputFile(`draws/${game_type}/old/${draw.drawNumber}/final-lines-to-hand-in.txt`, string_to_print);
    console.log();
    let turnover = drawTextFormatter.getTurnover(draw);
    console.log(`${Math.round((probability_of_13 - 1) * 1000) / 10}%`);
    console.log(`${Math.round((probability_of_13 - 1) * parseInt(draw.turnover) * 0.65 * 0.92)} SEK`);
    console.log(turnover);


    console.log('success!')
  } catch
      (err) {
    console.error(err)
  }
}

async function infLoop() {
  await fetchDraw();
  await setInterval(async () => {
    await infLoop()
  }, 2 * 60 * 1000);
}

// Or
const main = async function () {
  await infLoop();
};


(async () => {
  await main();
})().catch(e => {
  console.log("error, " + e)
});

function printStats(draw) {
  console.log(draw);
}

