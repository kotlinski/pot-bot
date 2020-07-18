import draw_fetcher from "./svenskaspel/fetch/draw-fetcher";
import {generateLinesForDraw} from "./analyze/analyze-draw";

exports.fetchCurrentDraw = async (svenskaspel_api_key, game_type) => {
  return await draw_fetcher.fetchNextDraw(game_type, svenskaspel_api_key, true);
};

exports.analyzeCurrentDraw = async (game_type, number_of_lines) => {
  return await generateLinesForDraw(game_type, number_of_lines);
};
