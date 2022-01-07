#!/usr/bin/env node

// import {sendMail} from "../mail/send-email";
/*
import DrawFetcher from '../../svenskaspel/fetch/draw-fetcher';

process.env.NODE_CONFIG_DIR = './config';

import draw_validator from '../../svenskaspel/fetch/draw-validator';
import moment from 'moment';
import delay from 'delay';
import optimist from 'optimist';
import config from 'config';
import drawTextFormatter from '../../svenskaspel/draw-text-formatter';

const argv = optimist.default(['game_type']).default(['svenskaspel_api_key']).argv;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

async function infLoop(game_type: string, svenskaspel_api_key: string) {
  if (game_type === 'europatipset') {
    // Delay ten seconds to separate the two different game types
    await delay(10 * 1000);
  }
  let sleep = 0;
  try {
    console.log('Fetching draw...');
    const draw_fetcher = new DrawFetcher();
    const draw = await draw_fetcher.fetchNextDraw(game_type, svenskaspel_api_key, true);
    // await sendMail(draw);
    console.log('Done!');
    const time_until_deadline = draw_validator.minutesUntilClose(draw);
    if (time_until_deadline < 0) {
      console.log(`Draw was in the past.`);
      return;
    } else if (time_until_deadline < 10) {
      sleep = 2;
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
    const deadline = draw_validator.closeTime(draw);
    console.log();
    const turnover = drawTextFormatter.getTurnover(draw);
    console.log(turnover);
    console.log();
    console.log(
      `${moment().format('HH:mm')}, ${capitalize(game_type)}: Fetching next draw ${from_now}. \nDeadline: ${moment(
        deadline,
      ).format('dddd HH:mm')}`,
    );
  } catch (error) {
    sleep = 12 * 60;
    console.log('Could not parse next draw.', error);
    console.log();
    const from_now = moment(moment().add(sleep, 'minutes')).fromNow();
    console.log(`${moment().format('HH:mm')}, ${capitalize(game_type)}: Fetching next draw ${from_now}.`);
  }
  await delay(sleep * 60 * 1000);
  await infLoop(game_type, svenskaspel_api_key);
}

// Or
const main = async function () {
  if (!argv.svenskaspel_api_key && !config.get('svenska_spel_api.access_key')) {
    console.log('No Svenskaspel api key provided');
    return;
  }
  const svenskaspel_api_key = config.get('svenska_spel_api.access_key')
    ? config.get('svenska_spel_api.access_key')
    : argv.svenskaspel_api_key;
  console.log('argv.game_type: ', JSON.stringify(argv.game_type, null, 2));
  if (!argv.game_type) {
    console.log('No game type selected, will download both stryktipset and europatipset');
    await Promise.all([infLoop('europatipset', svenskaspel_api_key), infLoop('stryktipset', svenskaspel_api_key)]);
    console.log('done with promises');
    return;
  }
  await infLoop(argv.game_type, svenskaspel_api_key);
};

(async () => {
  await main();
})().catch((e) => {
  if (typeof e === 'string') {
    console.log(`error, ${e.toUpperCase()}`);
  } else if (e instanceof String) {
    console.log(`error in main`);
  }
});
*/
