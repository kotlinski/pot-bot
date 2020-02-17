import axios from "axios";
import config from "config";

const api = {

  async getNextDraw(game_type) {
    try {
      const url = `https://api.www.svenskaspel.se/external/draw/${game_type}/draws?accesskey=${config.get("svenska_spel_api.access_key")}`;
      console.log(url);
      const response = await axios.get(url);
      return response.data.draws[0];
    } catch (error) {
      console.log(error);
    }
  },

  async getDraw(game_type, id) {
    try {
      const url = `https://api.www.svenskaspel.se/external/draw/${game_type}/draws/${id}?accesskey=${config.get("svenska_spel_api.access_key")}`;
      const response = await axios.get(url);
      return response.data.draw;
    } catch (error) {
      console.log(error);
    }
  },

  async getResults(game_type, id) {
    try {
      const url = `https://api.www.svenskaspel.se/external/draw/${game_type}/draws/${id}/result?accesskey=${config.get("svenska_spel_api.access_key")}`;
      const response = await axios.get(url);
      return response.data.result;
    } catch (error) {
      console.log(error);
    }

  }

};

export default api;
