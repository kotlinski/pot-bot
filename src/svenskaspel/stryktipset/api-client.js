import axios from "axios";
import config from "config";
import drawStore from "./draw-store";

const api = {

  async getNextDraw() {
    try {
      const url = `https://api.www.svenskaspel.se/external/draw/stryktipset/draws?accesskey=${config.get("svenska_spel_api.access_key")}`;
      const response = await axios.get(url);
      return response.data.draws[0];
    } catch (error) {
      console.log(error);
    }
  },

  async getDraw(id, use_cached_data) {
    /*    if (use_cached_data) {
          await drawStore.getStoredDraw(id);
        }*/
    try {
      const url = `https://api.www.svenskaspel.se/external/draw/stryktipset/draws/${id}?accesskey=${config.get("svenska_spel_api.access_key")}`;
      const response = await axios.get(url);
      return response.data.draw;
    } catch (error) {
      console.log(error);
    }
  },

  async getResults(id) {
    try {
      const url = `https://api.www.svenskaspel.se/external/draw/stryktipset/draws/${id}/result?accesskey=${config.get("svenska_spel_api.access_key")}`;
      const response = await axios.get(url);
      return response.data.result;
    } catch (error) {
      console.log(error);
    }

  }

};

export default api;
