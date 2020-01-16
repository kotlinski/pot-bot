import axios from "axios";
import config from "config";

export async function getDraw() {
  try {
    const url = `https://api.www.svenskaspel.se/external/draw/stryktipset/draws?accesskey=${config.get("svenska_spel_api.access_key")}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

