import draw_fetcher from "./svenskaspel/fetch/draw-fetcher";

exports.fetchCurrentDraw = async (svenskaspel_api_key, game_type) => {
  return await draw_fetcher.fetchNextDraw(game_type, svenskaspel_api_key, true);
};
