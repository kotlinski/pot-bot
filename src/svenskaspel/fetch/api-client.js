import axios from "axios";

const api = {

  async getNextDraw(game_type, svenskaspel_api_key) {
    try {
      const url = `https://api.www.svenskaspel.se/external/draw/${game_type}/draws?accesskey=${svenskaspel_api_key}`;
      console.log(url);
      const response = await axios.get(url);
      return response.data.draws[0];
    } catch (error) {
      console.log(`could not fetch next draw, status: ${error.response.status}`, error.response.data);
    }
  },

  async getDraw(game_type, id, svenskaspel_api_key) {
    try {
      const url = `https://api.www.svenskaspel.se/external/draw/${game_type}/draws/${id}?accesskey=${svenskaspel_api_key}`;
      const response = await axios.get(url);
      return response.data.draw;
    } catch (error) {
      console.log(`could not fetch draw, status: ${error.response.status}`, error.response.data);
    }
  },

  async getResults(game_type, id, svenskaspel_api_key) {
    try {
      const url = `https://api.www.svenskaspel.se/external/draw/${game_type}/draws/${id}/result?accesskey=${svenskaspel_api_key}`;
      const response = await axios.get(url);
      return response.data.result;
    } catch (error) {
      console.log(`could not fetch results, status: ${error.response.status}`, error.response.data);
    }

  }

};

export default api;
