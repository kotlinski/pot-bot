import draw_fetcher from "./svenskaspel/stryktipset/draw-fetcher.js";
import drawTextFormatter from "./svenskaspel/draw-text-formatter.js";
import drawCleaner from "./svenskaspel/draw-cleaner.js";
import draw_validator from "./svenskaspel/stryktipset/draw-validator.js";
import combinationGenerator from "./svenskaspel/combinations/draw-bet-combination-generator";
import betPicker from "./svenskaspel/combinations/draw-bet-picker";
import fs from 'fs-extra';
import drawStore from "./svenskaspel/stryktipset/draw-store";


async function fetchDraw() {
  console.log("Fetching next draw");
  let draw = await draw_fetcher.fetchNextDraw();
  if (!draw || !draw_validator.hasOdds(draw)) {
    console.log("Can't compute upcoming draw");
    return;
  }
  try {
    let cleanDraw = drawCleaner.cleanDraw(draw);
    await drawStore.storeCleanDraw(cleanDraw);

    const combinations = combinationGenerator.generateAllCombinations(cleanDraw);
    const bets = betPicker.pickBets(combinations);


    let string_to_print = "Stryktipset\n";
    let probability_of_13 = 1;
    for (const line of bets) {
      string_to_print += `${line.id}\n`;
      console.log(line.id);
      probability_of_13 += line.odds_rate;
    }
    console.log('Saving file');
    await fs.outputFile(`draws/stryktipset/${draw.drawNumber}/final.txt`, string_to_print);
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

