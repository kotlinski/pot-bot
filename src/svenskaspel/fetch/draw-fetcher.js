import fs from "fs-extra";
import draw_validator from './draw-validator';
import draw_store from './draw-store';
import api_client from '../fetch/api-client';

const api = {

  async fetchNextDraw(game_type, force_fetch = false) {
    try {
      let draw;
      let draw_from_file;
      try {
        draw_from_file = await fs.readJson(`./draws/${game_type}/current/raw.json`);
      } catch (error) {
        console.log("No cached data for this draw");
      }

      if (draw_from_file && !draw_validator.isCurrentDraw(draw_from_file)) {
        await fs.emptyDirSync(`./draws/${game_type}/current`);
        return;
      }
      if (draw_from_file &&
          draw_validator.isCurrentDraw(draw_from_file) &&
          !draw_validator.isLastDay(draw_from_file) &&
          !force_fetch) {
        return draw_from_file;
      }
      console.log("game type: " + game_type);
      draw = await api_client.getNextDraw(game_type);
      if (draw) {
        await draw_store.storeDraw(game_type, draw);
        return draw;
      }
      return draw_from_file;
    } catch (err) {
      console.log(err);
    }
  },

  async fetchDraw(game_type, draw_number) {
    try {
      console.log("game type: " + game_type);
      const draw = await api_client.getDraw(game_type, draw_number);
      if (draw) {
        await draw_store.storeDraw(game_type, draw);
        return draw;
      }
    } catch (err) {
      console.log(err);
    }
  },

  async fetchResults(game_type, draw_number) {
    try {
      console.log("game type: " + game_type);
      const results = await api_client.getResults(game_type, draw_number);
      if (results) {
        await draw_store.storeResults(game_type, results);
        return results;
      }
    } catch (err) {
      console.log(err);
    }
  },

};

export default api;
