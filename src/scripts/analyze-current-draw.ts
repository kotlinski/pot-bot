import {analyzeCurrentDraw} from "../analyze/analyze-draw";

const argv = require('optimist')
    .demand(['game_type', 'number_of_lines'])
    .argv;


const main = async function () {
  if (!argv.game_type) {
    console.log('No game type selected, will download both stryktipset and europatipset');
    return;
  }
  if (!argv.number_of_lines) {
    console.log('How many lines to you want to bet? add param: number_of_lines');
    return;
  }
  await analyzeCurrentDraw(argv.game_type, parseInt(argv.number_of_lines));
};


(async () => {
  await main();
})().catch(e => {
  console.log("error, " + e)
});

