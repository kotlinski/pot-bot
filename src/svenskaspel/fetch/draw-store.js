import fs from "fs-extra";
import draw_validator from "./draw-validator";
import moment from 'moment';

function getFormattedToday() {
  return moment().format('YYYYMMDDTHHmm');
}

async function storeCurrentDraw(game_type, draw) {
  await fs.mkdir(`./draws/${game_type}/current`, {recursive: true});
  let file_name = `draw.json`;
  if (!draw_validator.hasOdds(draw)) {
    file_name = `draw-without-odds.json`;
  }
  await fs.writeJson(`draws/${game_type}/current/${file_name}`, draw, {spaces: 2, EOL: '\n'});
}

async function storeCurrentCleanDraw(game_type, clean_draw) {
  await fs.mkdir(`./draws/${game_type}/current`, {recursive: true});
  await fs.writeJson(`draws/${game_type}/current/clean-draw.json`, clean_draw, {
    spaces: 2,
    EOL: '\n'
  });
}

export function getCurrentDraw(game_type) {
  return fs.readJson(`draws/${game_type}/current/draw.json`)
}


export async function storeDraw(game_type, draw) {
  const draw_number = draw.drawNumber;
  await fs.mkdir(`./draws/${game_type}/old/${draw_number}/draw-history/`, {recursive: true});
  let fileName = `draw.json`;
  if (draw_validator.isAfterCloseTime(draw)) {
    fileName = `raw-after-deadline.json`;
  } else if (!draw_validator.hasOdds(draw)) {
    fileName = `draw-without-odds.json`;
  }
  await fs.writeJson(`draws/${game_type}/old/${draw_number}/${fileName}`, draw, {spaces: 2, EOL: '\n'});
  await fs.writeJson(`draws/${game_type}/old/${draw_number}/draw-history/${getFormattedToday()}.json`, draw, {
    spaces: 2,
    EOL: '\n'
  });

  if (draw_validator.isCurrentDraw(draw)) {
    await storeCurrentDraw(game_type, draw);
  }
}

export async function storeResults(game_type, results) {
  const draw_number = results.drawNumber;
  await fs.mkdir(`./draws/${game_type}/old/${draw_number}`, {recursive: true});
  await fs.writeJson(`draws/${game_type}/old/${draw_number}/results.json`, results, {
    spaces: 2,
    EOL: '\n'
  });
}

export async function storeCleanDraw(game_type, clean_draw) {
  const draw_number = clean_draw.drawNumber;
  await fs.mkdir(`./draws/${game_type}/${draw_number}/calculations`, {recursive: true});
  await fs.writeJson(`draws/${game_type}/${draw_number}/calculations/clean.json`, clean_draw, {spaces: 2, EOL: '\n'});
  if (draw_validator.isCurrentDraw(clean_draw)) {
    await storeCurrentCleanDraw(game_type, clean_draw);
  }
}

