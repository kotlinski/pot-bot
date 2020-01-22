import apiClient from "./svenskaspel/stryktipset/api-client.js";
import drawTextFormatter from "./svenskaspel/draw-text-formatter.js";
import drawCleaner from "./svenskaspel/draw-cleaner.js";
import combinationGenerator from "./svenskaspel/combinations/draw-bet-combination-generator";
import betPicker from "./svenskaspel/combinations/draw-bet-picker";
import fs from 'fs-extra';
import dateFormat from 'dateformat';

async function fetchDraw() {
  console.log("Fetching next draw");
  let draw = await apiClient.getNextDraw();
  try {
    let drawNumber = drawTextFormatter.getDrawNumber(draw);
    const formatted_today = dateFormat(new Date(), "yyyy-mm-dd HH:MM");
    console.log(formatted_today);
    await fs.mkdir(`./current/${drawNumber}/raw`, {recursive: true});
    await fs.mkdir(`./current/${drawNumber}/clean`, {recursive: true});
    await fs.writeJson(`current/${drawNumber}/raw/${formatted_today}.json`, draw, {spaces: 2, EOL: '\n'});

    let cleanDraw = drawCleaner.cleanDraw(draw);
    await fs.writeJson(`current/${drawNumber}/clean/${formatted_today}.json`, cleanDraw, {spaces: 2, EOL: '\n'});

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
    await fs.outputFile(`current/${drawNumber}/final.txt`, string_to_print);
    console.log();
    let turnover = drawTextFormatter.getTurnover(draw);
    console.log(`${Math.round((probability_of_13 - 1) * 1000) / 10}%`);
    console.log(`${Math.round((probability_of_13 - 1) * parseInt(draw.turnover) * 0.65 * 0.92)} SEK`);
    console.log(turnover);


    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}

async function infLoop() {
  await fetchDraw();
  await setInterval(async () => {
    await infLoop()
  }, 3 * 60 * 1000);
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

