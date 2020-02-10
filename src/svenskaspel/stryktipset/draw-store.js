import dateFormat from "dateformat";
import fs from "fs-extra";
import draw_validator from "./draw-validator";

function getFormattedToday() {
  return dateFormat(new Date(), "yyyy-mm-dd HH:MM");
}

async function storeCurrentDraw(draw) {
  await fs.mkdir(`./draws/stryktipset/current`, {recursive: true});
  let fileName = `raw.json`;
  if (!draw_validator.hasOdds(draw)) {
    fileName = `raw-without-odds.json`;
  }
  await fs.writeJson(`draws/stryktipset/current/${fileName}`, draw, {spaces: 2, EOL: '\n'});
}

async function storeCurrentCleanDraw(cleanDraw) {
  await fs.mkdir(`./draws/stryktipset/current`, {recursive: true});
  await fs.writeJson(`draws/stryktipset/current/clean.json`, cleanDraw, {
    spaces: 2,
    EOL: '\n'
  });
}

const api = {

  async storeDraw(draw) {
    const drawNumber = draw.drawNumber;
    const formatted_today = dateFormat(new Date(), "yyyy-mm-dd HH:MM");
    console.log(formatted_today);
    await fs.mkdir(`./draws/stryktipset/${drawNumber}/raw-history/`, {recursive: true});
    let fileName = `raw.json`;
    if (!draw_validator.hasOdds(draw)) {
      fileName = `raw-without-odds.json`;
    }
    await fs.writeJson(`draws/stryktipset/${drawNumber}/raw-history/${getFormattedToday()}.json`, draw, {
      spaces: 2,
      EOL: '\n'
    });
    await fs.writeJson(`draws/stryktipset/${drawNumber}/${fileName}`, draw, {spaces: 2, EOL: '\n'});

    if (draw_validator.isCurrentDraw(draw)) {
      await storeCurrentDraw(draw);
    }
  },

  async storeCleanDraw(cleanDraw) {
    const drawNumber = cleanDraw.drawNumber;
    await fs.mkdir(`./draws/stryktipset/${drawNumber}/clean-history`, {recursive: true});
    await fs.writeJson(`draws/stryktipset/${drawNumber}/clean-history/${getFormattedToday()}.json`, cleanDraw, {
      spaces: 2,
      EOL: '\n'
    });
    await fs.writeJson(`draws/stryktipset/${drawNumber}/clean.json`, cleanDraw, {spaces: 2, EOL: '\n'});

    if (draw_validator.isCurrentDraw(cleanDraw)) {
      await storeCurrentCleanDraw(cleanDraw);
    }
  }

};

export default api;
