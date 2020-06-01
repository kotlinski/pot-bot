import {getCurrentBets} from "../svenskaspel/fetch/draw-store";


const argv = require('optimist')
    .demand(['game_type', 'correct_results'])
    .argv;

async function verifyBetsWithCurrentResults(game_type, correct_results) {
  console.log("correct_results: ", JSON.stringify(correct_results, null, 2));
  correct_results = correct_results.replace(/,/g, '');

  console.log("Reading current draw...");
  let bets;
  try {
    bets = await getCurrentBets(game_type);
  } catch (error) {
    console.log('Could not read current draw, please fetch again `npm run fetch-current-draw`', error)
  }
  try {
    let correct_count = [];
    for (let i = 0; i < correct_results.length; i++) {
      let correct_char = correct_results.charAt(i);
      console.log(i+1 + ". " + correct_char);
      for (let bet_index = 0; bet_index < bets.length; bet_index++) {
        if (correct_count[bet_index] === undefined) {
          correct_count[bet_index] = 0;
        }
        if (bets[bet_index][i] === correct_char || correct_char === '*') {
          correct_count[bet_index] += 1;
        }
      }
    }
    correct_count = correct_count.filter(count => count > 9);

    let result = correct_count.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null));
    console.log("result: ", JSON.stringify(result, null, 2));

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
  if (!argv.correct_results) {
    console.log('Mark results with commas and non played games with a "*": 1,2,X,*,1,X...');
    return;
  }
  await verifyBetsWithCurrentResults(argv.game_type, argv.correct_results);
};


(async () => {
  await main();
})().catch(e => {
  console.log("error, " + e)
});

