import {readJson, writeJson} from "fs-extra";
import draw_validator from "./draw-validator";
import moment from 'moment';
import {mkdirSync} from "fs";

function getFormattedToday() {
  return moment().format('YYYYMMDDTHHmm');
}

async function storeCurrentDraw(game_type: string, draw: any) {
  await mkdirSync(`./draws/${game_type}/current`,  {recursive: true});
  let file_name = `draw-before-deadline.json`;
  if (!draw_validator.hasOdds(draw)) {
    file_name = `draw-without-odds.json`;
  }
  await writeJson(`draws/${game_type}/current/${file_name}`, draw, {spaces: 2, EOL: '\n'});
}

async function storeCurrentCleanDraw(game_type: string, clean_draw: any) {
  await mkdirSync(`./draws/${game_type}/current`,  {recursive: true});
  await writeJson(`draws/${game_type}/current/clean-draw.json`, clean_draw, {
    spaces: 2,
    EOL: '\n'
  });
}

export async function getDraw(game_type: string, draw_number: number) {
  return await readJson(`./draws/${game_type}/old/${draw_number}/draw-before-deadline.json`);
}
export async function getCurrentDraw(game_type: string) {
  return await readJson(`./draws/${game_type}/current/draw-before-deadline.json`);
}
export async function getFinalBets(game_type: string, file_name = 'final' ) {
  return await readJson(`./draws/${game_type}/current/${file_name}.json`);
}


export async function storeDraw(game_type: string, draw: any) {
  const draw_number = draw.drawNumber;
  await mkdirSync(`./draws/${game_type}/old/${draw_number}/draw-history/`,  {recursive: true});
  let fileName = `draw-before-deadline.json`;
  if (draw_validator.isAfterCloseTime(draw)) {
    fileName = `draw-after-deadline.json`;
  } else if (!draw_validator.hasOdds(draw)) {
    fileName = `draw-without-odds.json`;
  }
  await writeJson(`draws/${game_type}/old/${draw_number}/${fileName}`, draw, {spaces: 2, EOL: '\n'});
  await writeJson(`draws/${game_type}/old/${draw_number}/draw-history/${getFormattedToday()}.json`, draw, {
    spaces: 2,
    EOL: '\n'
  });

  if (draw_validator.isCurrentDraw(draw)) {
    await storeCurrentDraw(game_type, draw);
  }
}

export async function storeResults(game_type: string, results:any) {
  const draw_number = results.drawNumber;
  await mkdirSync(`./draws/${game_type}/old/${draw_number}`,  {recursive: true});
  await writeJson(`draws/${game_type}/old/${draw_number}/results.json`, results, {
    spaces: 2,
    EOL: '\n'
  });
}

export async function storeCleanDraw(game_type: string, clean_draw: any) {
  const draw_number = clean_draw.drawNumber;
  await mkdirSync(`./draws/${game_type}/${draw_number}/calculations`,  {recursive: true});
  await writeJson(`draws/${game_type}/${draw_number}/calculations/clean.json`, clean_draw, {spaces: 2, EOL: '\n'});
  if (draw_validator.isCurrentDraw(clean_draw)) {
    await storeCurrentCleanDraw(game_type, clean_draw);
  }
}

