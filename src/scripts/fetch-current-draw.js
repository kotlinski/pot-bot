import draw_fetcher from "./../svenskaspel/fetch/draw-fetcher.js";
import draw_validator from "./../svenskaspel/fetch/draw-validator.js";
import moment from 'moment';
import delay from 'delay';

const argv = require('optimist')
    .default(['game_type'])
    .argv;

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
};

async function infLoop(game_type) {
  if (game_type === 'europatipset') {
    // Delay ten seconds to separate the two different game types
    await delay(10000);
  }
  let sleep = 0;
  try {
    console.log('Fetching draw...');
    let draw = await draw_fetcher.fetchNextDraw(game_type, true);
    console.log('Done!');
    let time_until_deadline = draw_validator.hoursUntilCloseTime(draw);
    if (time_until_deadline < 0) {
      console.log(`Draw was in the past.`);
      return;
    } else if (time_until_deadline < 10) {
      sleep = 1;
    } else if (time_until_deadline < 25) {
      sleep = 5;
    } else if (time_until_deadline < 120) {
      sleep = 15;
    } else if (time_until_deadline < 24 * 60) {
      sleep = 60;
    } else {
      sleep = 12 * 60;
    }
    const from_now = moment(moment().add(sleep, 'minutes')).fromNow();
    let deadline = draw_validator.closeTime(draw);
    console.log(`${moment().format('HH:mm')}, ${capitalize(game_type)}: Fetching next draw ${from_now}. \nDeadline: ${moment(deadline).format('dddd HH:mm')}`);
  } catch (error) {
    sleep = 12 * 60;
    console.log('Could not parse next draw.', error.message);
    console.log();
    const from_now = moment(moment().add(sleep, 'minutes')).fromNow();
    console.log(`${moment().format('HH:mm')}, ${capitalize(game_type)}: Fetching next draw ${from_now}.`);
  }
  await delay(sleep * 60 * 1000);
  await infLoop(game_type)
}

// Or
const main = async function () {
  if (!argv.game_type) {
    console.log('No game type selected, will download both stryktipset and europatipset');
    await Promise.all([infLoop('europatipset'), infLoop('stryktipset')]);
    console.log("done with promises");
    return;
  }
  await infLoop(argv.game_type);
};


(async () => {
  await main();
})().catch(e => {
  console.log("error, " + e)
});

function printStats(draw) {
  console.log(draw);
}
