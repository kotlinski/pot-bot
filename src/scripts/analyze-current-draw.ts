import {generateLinesForDraw} from "../analyze/analyze-draw";
import {DrawConfig} from "../analyze/draw-config";

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
  const draw_config: DrawConfig = {
    game_type: argv.game_type,
    number_of_lines_to_pick: parseInt(argv.number_of_lines),
    number_of_focused_bets_to_align: 5,
    bet_value_quota: 0.5,
    number_of_X_signs: 1,
  };
  await generateLinesForDraw(draw_config);
};


(async () => {
  await main();
})().catch(e => {
  console.log("error, " + e)
});

