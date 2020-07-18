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
  console.log("correct_results: ", JSON.stringify(argv.correct_results, null, 2));
  const correct_results = argv.correct_results.replace(/[0-9]*[:]|,|[ ]/g, '');
  if (correct_results.length < 13) {
    console.log('try with: 1:*, 2:*, 3:*, 4:*, 5:*, 6:*, 7:*, 8:*, 9:*, 10:*, 11:*, 12:*, 13:*');
    return;
  }
  await verifyBetsWithCurrentResults(argv.game_type, correct_results, argv.file_name);
};


(async () => {
  await main();
})().catch(e => {
  console.log("error, " + e)
});

