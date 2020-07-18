import apiClient from '../svenskaspel/fetch/api-client.ts';
import drawTextFormatter from "../svenskaspel/draw-text-formatter.ts";
import drawCleaner from "../svenskaspel/draw-cleaner.ts";
import {getAllPossibleCombinations} from "../svenskaspel/combinations/generate-all-possible-combinations";
import betPicker from "../svenskaspel/combinations/draw-bet-picker";
import fs from 'fs-extra';
import {storeCleanDraw} from "../svenskaspel/fetch/draw-store";

const os = require("os");


const argv = require('optimist')
    .demand(['draw_number', 'game_type'])
    .argv;


async function printToCSV(game_type: string, draw_number: number, combinations: any) {
  let combinations_string = combinations.map((combination: any) => {
    return `${combination.id},${combination.odds_rate.toFixed(4)},${combination.bet_value_rate.toFixed(4)},${combination.score}${os.EOL}`;
  });
  let combinations_string_return = "id, 'odds rate', 'value rate', score" + os.EOL + combinations_string.join('');
  await fs.outputFile(`draws/${game_type}/old/${draw_number}/combinations.csv`, combinations_string_return);
}

function blendDrawAndResults(draw: any, result: any) {
  draw.events = draw.events.map((event: any) => {
    const result_event = result.events.find((result_event: any) => {
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

async function analyzeDraw(game_type: string, draw_number: number, svenskaspel_api_key: string) {
  console.log("Fetching next draw");
  let draw = await apiClient.getDraw(game_type, draw_number, svenskaspel_api_key);
  let result = await apiClient.getResults(game_type, draw_number, svenskaspel_api_key);
  try {
    blendDrawAndResults(draw, result);
    let cleanDraw = drawCleaner.massageData(draw);
    await storeCleanDraw(game_type, cleanDraw);

    const combinations = getAllPossibleCombinations();
    const bets = betPicker.pickBets(undefined, combinations);

    await printToCSV(game_type, draw_number, combinations);


    // let string_to_print: string = "Stryktipset\n";
    let probability_of_13 = 1;
    for (const line of bets) {
      // string_to_print += `${line.id}\n`;
      console.log(line.id);
      probability_of_13 += line.odds_rate;
    }
    console.log('Saving file');
    // await fs.outputFile(`draws/${game_type}/old/${draw_number}/final-100.txt`, string_to_print);
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

const main = async function () {
  if (!argv.game_type) {
    console.log('No game type selected, will download both stryktipset and europatipset');
    return;
  }
  if (!argv.draw_number) {
    console.log('No draw_number slected');
    return;
  }
  if (!argv.svenskaspel_api_key) {
    console.log('No api key provided');
    return;
  }
  await analyzeDraw(argv.game_type, parseInt(argv.draw_number), argv.svenskaspel_api_key);
};


(async () => {
  await main();
})().catch(e => {
  console.log("error, " + e)
});

