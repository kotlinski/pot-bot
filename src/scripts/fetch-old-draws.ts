import draw_fetcher from "../svenskaspel/fetch/draw-fetcher.js";

const argv = require('optimist')
    .default(['game_type'])
    .default(['draw_number'])
    .default(['svenskaspel_api_key'])
    .argv;


async function infLoop(game_type: string, draw_number: number, svenskaspel_api_key: string) {
  await setInterval(async () => {
    console.log(`Fetching draw ${draw_number}`);
    await draw_fetcher.fetchDraw(game_type, draw_number, svenskaspel_api_key);
    console.log('Done!');
    draw_number--;
  }, 5 * 1000);
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
    console.log('No api key');
    return;
  }
  await infLoop(argv.game_type, parseInt(argv.draw_number), argv.svenskaspel_api_key);
};


(async () => {
  await main();
})().catch(e => {
  console.log("error, " + e)
});

