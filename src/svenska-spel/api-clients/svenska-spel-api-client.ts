import axios from 'axios';
import { SvenskaSpelApiDraws, SvenskaSpelDraw } from './interfaces/svenskaspel-interfaces';
import DrawHelper from '../draw-helper';

export default class SvenskaSpelApiClient {
  readonly draw_helper: DrawHelper;
  constructor(private readonly api_key: string, private readonly game_type: 'europatipset' | 'stryktipset') {
    this.draw_helper = new DrawHelper();
  }

  /*  public async fetchCurrentDraw(): Promise<SvenskaSpelDraw> {
    console.log('Fetching draw from svenskaspel...');
    let draw: SvenskaSpelDraw;
    try {
      const url = `https://api.www.svenskaspel.se/external/draw/${this.game_type}/draws?accesskey=${this.api_key}`;
      console.log(url);
      const response = await axios.get<SvenskaSpelApiDraws>(url);
      draw = response.data.draws[0];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(`could not fetch next draw, status: ${error.response.status}`, error.response.data);
      }
      throw error;
    }
    if (this.draw_helper.isCurrentDraw(draw)) {
      return draw;
    }
    throw new Error('No current draw');
  }*/

  public async fetchDraw(id?: number): Promise<SvenskaSpelDraw> {
    console.log('Fetching draw from svenskaspel...');
    const url = `https://api.www.svenskaspel.se/external/draw/${this.game_type}/draws/${id ?? ''}?accesskey=${this.api_key}`;
    try {
      const response = await axios.get<SvenskaSpelApiDraws>(url);
      return response.data.draws[0];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(`could not fetch draw, status: ${error.response.status}`, error.response.data);
      }
      throw error;
    }
  }
  /*
async getResults(game_type: string, id: number, svenskaspel_api_key: string) {
  try {
    const url = `https://api.www.svenskaspel.se/external/draw/${game_type}/draws/${id}/result?accesskey=${svenskaspel_api_key}`;
    const response = await axios.get(url);
    return response.data.result;
  } catch (error) {
    console.log(`could not fetch results, status: ${error.response.status}`, error.response.data);
  }
},*/
}
