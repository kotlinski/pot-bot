import {verifyBetsWithCurrentResults} from "../analyze/verifyt-ongoing-draw";

const argv = require('optimist')
    .default(['file_name'])
    .demand(['game_type', 'correct_results'])
    .argv;


const main = async function () {
  if (!argv.game_type) {
    console.log('No game type selected, will download both stryktipset and europatipset');
    return;
  }
  if (!argv.correct_results) {
    console.log('Mark results with commas and non played games with a "*": 1,2,X,*,1,X...');
    return;
  }
  await verifyBetsWithCurrentResults(argv.game_type, argv.correct_results, argv.file_name);
};


(async () => {
  await main();
})().catch(e => {
  console.log("error, " + e)
});

