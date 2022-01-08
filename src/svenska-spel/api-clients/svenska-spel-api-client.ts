import axios from 'axios';
import DrawHelper from '../draw/draw-helper';
import { SvenskaSpelApiDraw, SvenskaSpelApiDraws, SvenskaSpelDraw } from './interfaces/svenskaspel-draw-interfaces';
import { SvenskaSpelApiResult, SvenskaSpelResult } from './interfaces/svenskaspel-result-interfaces';

export default class SvenskaSpelApiClient {
  readonly BASE_URL: string;
  readonly draw_helper: DrawHelper;
  constructor(private readonly api_key: string, readonly game_type: 'europatipset' | 'stryktipset') {
    this.BASE_URL = `https://api.www.svenskaspel.se/external/draw/${game_type}/draws`;
    this.draw_helper = new DrawHelper();
  }

  public async fetchDraw(id?: number): Promise<SvenskaSpelDraw> {
    console.log(`Fetching draw from svenskaspel:  + ${this.BASE_URL}/${id ?? ''}`);
    const url = `${this.BASE_URL}/${id ?? ''}?accesskey=${this.api_key}`;
    try {
      if (id) {
        const response = await axios.get<SvenskaSpelApiDraw>(url);
        return response.data.draw;
      } else {
        const response = await axios.get<SvenskaSpelApiDraws>(url);
        return response.data.draws[0];
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(`could not fetch draw, status: ${error.response.status}`, error.response.data);
      }
      throw error;
    }
  }

  public async fetchResult(id?: number): Promise<SvenskaSpelResult> {
    console.log('Fetching result from svenskaspel...');
    const optional_id = `${id ? `/${id}` : ''}`;
    const url = `${this.BASE_URL}${optional_id}/result?accesskey=${this.api_key}`;
    try {
      const response = await axios.get<SvenskaSpelApiResult>(url);
      return response.data.result;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(`could not fetch result, status: ${error.response.status}`);
      }
      throw error;
    }
  }
}
