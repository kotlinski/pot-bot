import draw_fetcher from "./../svenskaspel/fetch/draw-fetcher.js";

const argv = require('optimist')
    .default(['game_type'])
    .default(['draw_number'])
    .argv;


async function infLoop(game_type, draw_number) {
  await setInterval(async () => {
    console.log(`Fetching draw ${draw_number}`);
    await draw_fetcher.fetchDraw(game_type, draw_number);
    console.log('Done!');
    draw_number--;
  }, 15 * 1000);
}

// Or
const main = async function () {
  if (!argv.game_type) {
    console.log('No game type selected, will download both stryktipset and europatipset');
    return;
  }
  if (!argv.draw_number) {
    console.log('No draw_number slected');
    return;
  }
  await infLoop(argv.game_type, parseInt(argv.draw_number));
};


(async () => {
  await main();
})().catch(e => {
  console.log("error, " + e)
});

