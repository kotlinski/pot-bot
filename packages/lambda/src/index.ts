import { DrawProvider, DropboxStore, GameType, SvenskaSpelApiClient } from 'tips';

export async function handler(): Promise<void> {
  const svenska_spel_api_key = process.env.SVENSKA_SPEL_API_KEY;
  if (!svenska_spel_api_key) {
    throw Error('no svenska spel api key added to env var SVENSKA_SPEL_API_KEY');
  }
  const dropbox_access_token = process.env.DROPBOX_ACCESS_TOKEN;
  if (!dropbox_access_token) {
    throw Error('no dropbox access token was added to env var DROPBOX_ACCESS_TOKEN');
  }
  try {
    const svenska_spel_api_client = new SvenskaSpelApiClient(svenska_spel_api_key, GameType.STRYKTIPSET);
    const dropbox_storage = new DropboxStore(GameType.STRYKTIPSET, dropbox_access_token);
    const draw_provider = new DrawProvider(svenska_spel_api_client, dropbox_storage);
    const draw = await draw_provider.getDraw();
    console.log(`Draw number ${draw.draw_number} was stored in dropbox`);
  } catch (e) {
    console.error('Failed fetching current draw');
    throw e;
  }
}
