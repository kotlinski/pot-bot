import apiClient from "./svenskaspel/stryktipset/api-client.js";
import drawTextFormatter from "./svenskaspel/draw-text-formatter.js";
import drawCleaner from "./svenskaspel/draw-cleaner.js";
import combinationGenerator from "./svenskaspel/combinations/draw-bet-combination-generator";
import betPicker from "./svenskaspel/combinations/draw-bet-picker";
import fs from 'fs-extra';
import drawStore from "./svenskaspel/stryktipset/draw-store";

const os = require("os");


const argv = require('optimist')
    .demand(['drawNumber'])
    .argv;


async function printToCSV(drawNumber, combinations) {
  let i = 0;
  let combinations_string = combinations.map(combination => {
    return `${combination.id},${combination.odds_rate.toFixed(4)},${combination.bet_value_rate.toFixed(4)},${combination.score}${os.EOL}`;
  });
  let combinations_string_return = "id, 'odds rate', 'value rate', score" + os.EOL + combinations_string.join('');
  await fs.outputFile(`draws/${drawNumber}/combinations.csv`, combinations_string_return);
}

function blendDrawAndResults(draw, result) {
  draw.events = draw.events.map(event => {
    const result_event = result.events.find(result_event => {
      return result_event.eventNumber === event.eventNumber;
    });
    event.outcome = result_event.outcome;
    event.outcome = {
      home: result_event.outcome === "1" ? 1 : 0,
      draw: result_event.outcome === "X" ? 1 : 0,
      away: result_event.outcome === "2" ? 1 : 0
    };
    return event;
  });
}

async function analyzeDraw(drawNumber) {
  const USE_CACHED_DATA = true;
  console.log("Fetching next draw");
  let draw = await apiClient.getDraw(drawNumber, USE_CACHED_DATA);
  let result = await apiClient.getResults(drawNumber);
  try {
    blendDrawAndResults(draw, result);
    let cleanDraw = drawCleaner.cleanDraw(draw);
    await drawStore.storeCleanDraw(cleanDraw);

    const combinations = combinationGenerator.generateAllCombinations(cleanDraw);
    const bets = betPicker.pickBets(combinations);

    await printToCSV(drawNumber, combinations);


    let string_to_print = "Stryktipset\n";
    let probability_of_13 = 1;
    for (const line of bets) {
      string_to_print += `${line.id}\n`;
      console.log(line.id);
      probability_of_13 += line.odds_rate;
    }
    console.log('Saving file');
    await fs.outputFile(`draws/${drawNumber}/final.txt`, string_to_print);
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


// Or
const main = async function () {
  const args = process.argv.slice(2);
  console.log(args);
  if (!argv.drawNumber) {
    console.log('Please provide a draw no. 0 to ~4633');
    return;
  }

  await analyzeDraw(argv.drawNumber);
};


(async () => {
  await main();
})().catch(e => {
  console.log("error, " + e)
});

function printStats(draw) {
  console.log(draw);
}

