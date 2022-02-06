import axios from 'axios';
import { SvenskaSpelDraw, SvenskaSpelResult } from '@pot-bot/core';

export default class DropboxApiClient {
  readonly BASE_URL: string;
  constructor(readonly access_token: string, readonly game_type: 'europatipset' | 'stryktipset') {
    this.BASE_URL = `https://content.dropboxapi.com/2/files/upload`;
  }

  public async storeResult(result: SvenskaSpelResult, path: string): Promise<void> {
    return this.store(result, path);
  }
  public async storeDraw(draw: SvenskaSpelDraw, path: string): Promise<void> {
    return this.store(draw, path);
  }
  private async store(draw: SvenskaSpelDraw | SvenskaSpelResult, path: string): Promise<void> {
    console.log(`Pushing file to dropbox`);
    const path_regex = new RegExp('(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)|(id:.*)');
    if (!path_regex.test(path)) {
      throw new Error(`Faulty path: ${path}`);
    }
    try {
      return await axios.post(this.BASE_URL, JSON.stringify(draw, null, 2), {
        headers: {
          'Authorization': `Bearer ${this.access_token}`,
          'Dropbox-API-Arg': JSON.stringify({ path, mode: 'add', autorename: false }),
          'Content-Type': 'text/plain; charset=dropbox-cors-hack',
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(`could not fetch draw, status: ${error.response.status}`, error.response.data);
      }
      throw error;
    }
  }
}
