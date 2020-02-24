import draw_fetcher from "./../svenskaspel/fetch/draw-fetcher.js";
import draw_validator from "./../svenskaspel/fetch/draw-validator.js";
import moment from 'moment';

const argv = require('optimist')
    .default(['game_type'])
    .argv;

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
};

async function infLoop(game_type) {
  let sleep = 12 * 60;
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
    console.log(`${capitalize(game_type)}, ${moment().format('HH:mm')}: Fetching next draw ${from_now}. Deadline: ${moment(deadline).format('dddd HH:mm')}`);
  } catch (error) {
    console.log('Could not parse next draw.', error);
    const from_now = moment(moment().add(sleep, 'minutes')).fromNow();
    console.log(`${capitalize(game_type)}, ${moment().format('HH:mm')}: Fetching next draw ${from_now}.`);
  }
  await setInterval(async () => {
    await infLoop(game_type)
  }, sleep * 60 * 1000);
}

// Or
const main = async function () {
  if (!argv.game_type) {
    console.log('No game type selected, will download both stryktipset and europatipset');
    let stryktipset_promise = await infLoop('stryktipset');
    let europatipset_promise = await infLoop('europatipset');
    Promise.all([stryktipset_promise, europatipset_promise]);
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

