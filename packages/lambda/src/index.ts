import { DrawProvider, GameType, ResultProvider, SvenskaSpelApiClient } from '@pot-bot/core';
import { DropboxStore } from '@pot-bot/dropbox';

interface LambdaInput {
  game_type: GameType;
}

export async function handler(context: LambdaInput): Promise<void> {
  const svenska_spel_api_key = process.env.SVENSKA_SPEL_API_KEY;
  if (!svenska_spel_api_key) {
    throw Error('no svenska spel api key added to env var SVENSKA_SPEL_API_KEY');
  }
  const dropbox_access_token = process.env.DROPBOX_ACCESS_TOKEN;
  if (!dropbox_access_token) {
    throw Error('no dropbox access token was added to env var DROPBOX_ACCESS_TOKEN');
  }
  try {
    const svenska_spel_api_client = new SvenskaSpelApiClient(svenska_spel_api_key, context.game_type);
    const dropbox_storage = new DropboxStore(context.game_type, dropbox_access_token);
    const draw_provider = new DrawProvider(svenska_spel_api_client, dropbox_storage);

    const draw = await draw_provider.getDraw();
    console.log(`Draw number ${draw.draw_number} was uploaded to dropbox`);
    const previous_draw_number = draw.draw_number - 1;
    const result_provider = new ResultProvider(svenska_spel_api_client, dropbox_storage);
    const result = await result_provider.getResult(previous_draw_number);
    console.log(`Last weeks results, draw number ${result.draw_number}, was uploaded to dropbox`);
  } catch (e) {
    console.error('Failed fetching current draw');
    throw e;
  }
}
