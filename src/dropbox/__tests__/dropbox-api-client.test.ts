import DropboxApiClient from '../dropbox-api-client';
import { readJson } from 'fs-extra';
import { SvenskaSpelDraw } from '../../svenska-spel/api-clients/interfaces/svenskaspel-draw-interfaces';
import config from 'config';
import axios from 'axios';
jest.mock('axios');

describe('dropbox-api-client', () => {
  const access_token: string = config.get('dropbox.access_token');
  const api_client = new DropboxApiClient(access_token, 'stryktipset');

  describe('Test pushing a file to dropbox', () => {
    let draw: SvenskaSpelDraw;
    // jest.spyOn(axios);
    beforeEach(async () => {
      const draws = await readJson('./src/fixtures/stryktipset/draw.json');
      draw = draws.draws[0];
    });
    it('should create a test file in dropbox', async () => {
      await expect(api_client.createFile(draw)).resolves.not.toThrow();
      expect(axios.post).toBeCalledWith('https://content.dropboxapi.com/2/files/upload', JSON.stringify(draw, null, 2), {
        headers: {
          'Authorization': 'Bearer dropbox-test-token',
          'Content-Type': 'text/plain; charset=dropbox-cors-hack',
          'Dropbox-API-Arg': '{"path":"/draw.json","mode":"add","autorename":false}',
        },
      });
    });
  });
});
