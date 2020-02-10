import fs from "fs-extra";
import draw_validator from './draw-validator';
import draw_store from './draw-store';
import api_client from './api-client';


const api = {

  async fetchNextDraw() {
    try {
      let draw;
      let draw_from_file;
      try {
        draw_from_file = await fs.readJson('./draws/stryktipset/current/raw.json');
      } catch (error){
        console.log("No cached data for this draw");
      }

      if (draw_from_file && !draw_validator.isCurrentDraw(draw_from_file)) {
        await fs.emptyDirSync('./draws/stryktipset/current');
        return;
      }
      if (draw_from_file && draw_validator.isCurrentDraw(draw_from_file) && !draw_validator.isLastDay(draw_from_file)) {
        return draw_from_file;
      }
      draw = await api_client.getNextDraw();
      if (draw) {
        await draw_store.storeDraw(draw);
        return draw;
      }
      return draw_from_file;
    } catch (err) {
      console.log(err);
    }
  },

};

export default api;
