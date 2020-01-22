import axios from "axios";
import config from "config";


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


  async getDraw(id) {
    try {
      const url = `https://api.www.svenskaspel.se/external/draw/stryktipset/draws/${id}?accesskey=${config.get("svenska_spel_api.access_key")}`;
      const response = await axios.get(url);

      const url_with_results = `https://api.www.svenskaspel.se/external/draw/stryktipset/draws/${id}/result?accesskey=${config.get("svenska_spel_api.access_key")}`;
      const result_response = await axios.get(url_with_results);

      response.data.draw.events = response.data.draw.events.map(event => {
        const result_event = result_response.data.result.events.find(result_event => {
          return result_event.eventNumber === event.eventNumber;
        });
        event.outcome = result_event.outcome;
        event.outcome = {
          home: result_event.outcome === "1" ? 1 : 0,
          draw: result_event.outcome === "X" ? 1 : 0,
          away: result_event.outcome === "2" ? 1 : 0
        };
        return event;
      });
      return response.data.draw;
    } catch (error) {
      console.log(error);
    }
  }

};

export default api;
