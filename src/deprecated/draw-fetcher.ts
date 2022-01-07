/*
import { storeDraw } from '../../storage/draw-store';
import api_client from '../../svenska-spel/api-clients/svenska-spel-api-client';
import { SvenskaSpelDraw } from '../../svenska-spel/api-clients/svenskaspel-interfaces';

export default class DrawFetcher {
  public async fetchNextDraw(game_type: string, svenskaspel_api_key: string, _force_fetch = false): Promise<SvenskaSpelDraw> {
    try {
      // let draw;
      // let draw_from_file;
      /*      try {
        draw_from_file = await fs.readJson(`./draws/${game_type}/current/raw.json`);
      } catch (error) {
        console.log('No cached data for this draw');
      }*/

      /*      if (draw_from_file && !draw_validator.isCurrentDraw(draw_from_file)) {
        await fs.emptyDirSync(`./draws/${game_type}/current`);
        return;
      }*/
      /*      if (
          draw_from_file &&
          draw_validator.isCurrentDraw(draw_from_file) &&
          !draw_validator.isLastDay(draw_from_file) &&
          !force_fetch
      ) {
        return draw_from_file;
      }
      console.log(`game type: ${game_type}`);
      const draw = await api_client.fetchCurrentDraw(game_type, svenskaspel_api_key);

      await storeDraw(game_type, draw);
      return draw;

      // return draw_from_file;
    } catch (err) {
      console.log(err);
      console.log();
      throw err;
    }
  }
}

/*
  async fetchDraw(game_type: string, draw_number: number, svenskaspel_api_key: string) {
    try {
      console.log(`game type: ${game_type}`);
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
      console.log(`game type: ${game_type}`);
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
*/
