import dateFormat from "dateformat";
import fs from "fs-extra";

function hasOdds(draw) {
  draw.events.forEach(event => {
    if (!event.odds) {
      return false;
    }
  });
  return true;
}


function getFormattedToday() {
  return dateFormat(new Date(), "yyyy-mm-dd HH:MM");
}

const api = {

  async storeDraw(draw) {
    const drawNumber = draw.drawNumber;
    const formatted_today = dateFormat(new Date(), "yyyy-mm-dd HH:MM");
    console.log(formatted_today);
    await fs.mkdir(`./draws/${drawNumber}/raw-history/`, {recursive: true});
    let fileName = `raw.json`;
    if (!hasOdds(draw)) {
      fileName = `raw-without-odds.json`;
    }
    await fs.writeJson(`draws/${drawNumber}/raw-history/${getFormattedToday()}.json`, draw, {spaces: 2, EOL: '\n'});
    await fs.writeJson(`draws/${drawNumber}/${fileName}`, draw, {spaces: 2, EOL: '\n'});
  },

  async storeCleanDraw(cleanDraw) {
    const drawNumber = cleanDraw.drawNumber;
    await fs.mkdir(`./draws/${drawNumber}/clean-history`, {recursive: true});
    await fs.writeJson(`draws/${drawNumber}/clean-history/${getFormattedToday()}.json`, cleanDraw, {
      spaces: 2,
      EOL: '\n'
    });
    await fs.writeJson(`draws/${drawNumber}/clean.json`, cleanDraw, {spaces: 2, EOL: '\n'});
  }

};

export default api;
