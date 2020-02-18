import fs from "fs-extra";
import draw_validator from "./draw-validator";
import moment from 'moment';

function getFormattedToday() {
  return moment().format('YYYYMMDDTHHmm');
}

async function storeCurrentDraw(game_type, draw) {
  await fs.mkdir(`./draws/${game_type}/current`, {recursive: true});
  let file_name = `raw.json`;
  if (!draw_validator.hasOdds(draw)) {
    file_name = `raw-without-odds.json`;
  }
  await fs.writeJson(`draws/${game_type}/current/${file_name}`, draw, {spaces: 2, EOL: '\n'});
}

async function storeCurrentCleanDraw(game_type, clean_draw) {
  await fs.mkdir(`./draws/${game_type}/current`, {recursive: true});
  await fs.writeJson(`draws/${game_type}/current/clean.json`, clean_draw, {
    spaces: 2,
    EOL: '\n'
  });
}

const api = {

  async storeDraw(game_type, draw) {
    const draw_number = draw.drawNumber;
    await fs.mkdir(`./draws/${game_type}/old/${draw_number}/raw-history/`, {recursive: true});
    let fileName = `raw`;
    if (draw_validator.isAfterCloseTime(draw)) {
      fileName = `raw-after-deadline.json`;
    }
    else if (!draw_validator.hasOdds(draw)) {
      fileName = `raw-without-odds.json`;
    }
    await fs.writeJson(`draws/${game_type}/old/${draw_number}/raw-history/${getFormattedToday()}.json`, draw, {
      spaces: 2,
      EOL: '\n'
    });
    await fs.writeJson(`draws/${game_type}/old/${draw_number}/${fileName}`, draw, {spaces: 2, EOL: '\n'});

    if (draw_validator.isCurrentDraw(draw)) {
      await storeCurrentDraw(game_type, draw);
    }
  },
  async storeResults(game_type, results) {
    const draw_number = results.drawNumber;
    await fs.mkdir(`./draws/${game_type}/old/${draw_number}`, {recursive: true});
    await fs.writeJson(`draws/${game_type}/old/${draw_number}/results.json`, results, {
      spaces: 2,
      EOL: '\n'
    });
  },

  async storeCleanDraw(game_type, cleanDraw) {
    const drawNumber = cleanDraw.drawNumber;
    await fs.mkdir(`./draws/${game_type}/${drawNumber}/clean-history`, {recursive: true});
    await fs.writeJson(`draws/${game_type}/${drawNumber}/clean-history/${getFormattedToday()}.json`, cleanDraw, {
      spaces: 2,
      EOL: '\n'
    });
    await fs.writeJson(`draws/${game_type}/${drawNumber}/clean.json`, cleanDraw, {spaces: 2, EOL: '\n'});

    if (draw_validator.isCurrentDraw(cleanDraw)) {
      await storeCurrentCleanDraw(game_type, cleanDraw);
    }
  }

};

export default api;
