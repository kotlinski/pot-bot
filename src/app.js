import draw_fetcher from "./svenskaspel/fetch/draw-fetcher";
import { analyzeCurrentDraw } from "./scripts/analyze-current-draw";

exports.fetchCurrentDraw = async (svenskaspel_api_key, game_type) => {
  return await draw_fetcher.fetchNextDraw(game_type, svenskaspel_api_key, true);
};

exports.analyzeCurrentDraw = async (game_type, number_of_lines) => {
  return await analyzeCurrentDraw(game_type, number_of_lines);
};
