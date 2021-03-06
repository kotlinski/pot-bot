import fs from "fs-extra";
import draw_validator from './draw-validator';
import {storeResults, storeDraw} from './draw-store';
import api_client from './api-client';

const api = {

  async fetchNextDraw(game_type: string, svenskaspel_api_key: string, force_fetch = false) {
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
      draw = await api_client.getNextDraw(game_type, svenskaspel_api_key);
      if (draw) {
        await storeDraw(game_type, draw);
        return draw;
      }
      return draw_from_file;
    } catch (err) {
      console.log(err);
      console.log();
    }
  },

  async fetchDraw(game_type: string, draw_number: number, svenskaspel_api_key: string) {
    try {
      console.log("game type: " + game_type);
      const draw = await api_client.getDraw(game_type, draw_number, svenskaspel_api_key);
      if (draw) {
        await storeDraw(game_type, draw);
        return draw;
      }
    } catch (err) {
      console.log(err);
    }
  },

  async fetchResults(game_type: string, draw_number: number, svenskaspel_api_key: string) {
    try {
      console.log("game type: " + game_type);
      const results = await api_client.getResults(game_type, draw_number, svenskaspel_api_key);
      if (results) {
        await storeResults(game_type, results);
        return results;
      }
    } catch (err) {
      console.log(err);
    }
  },

};

export default api;
