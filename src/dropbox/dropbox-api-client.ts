import axios from 'axios';
import { SvenskaSpelDraw } from '../svenska-spel/api-clients/interfaces/svenskaspel-draw-interfaces';

export default class DropboxApiClient {
  readonly BASE_URL: string;
  constructor(readonly access_token: string, readonly game_type: 'europatipset' | 'stryktipset') {
    this.BASE_URL = `https://content.dropboxapi.com/2/files/upload`;
  }

  public async createFile(draw: SvenskaSpelDraw): Promise<void> {
    console.log(`Pushing file to dropbox`);
    try {
      return await axios.post(this.BASE_URL, JSON.stringify(draw, null, 2), {
        headers: {
          'Authorization': `Bearer ${this.access_token}`,
          'Dropbox-API-Arg': JSON.stringify({ path: '/draw.json', mode: 'add', autorename: false }),
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
