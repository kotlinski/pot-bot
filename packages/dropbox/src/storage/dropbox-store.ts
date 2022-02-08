import DropboxApiClient from '../api-client/dropbox-api-client';
import { DrawHelper, GameType, Line, Storage, SvenskaSpelDraw, SvenskaSpelResult, getFormattedToday } from '@pot-bot/core';

export default class DropboxStore implements Storage {
  private readonly draw_helper: DrawHelper;
  private readonly api_client: DropboxApiClient;

  constructor(private readonly game_type: GameType, access_token: string) {
    this.draw_helper = new DrawHelper();
    this.api_client = new DropboxApiClient(access_token, game_type);
  }

  public async storeDraw(draw: SvenskaSpelDraw): Promise<void> {
    if (this.draw_helper.isCurrentDraw(draw)) {
      const base_folder = this.getBaseFolder(draw);
      await this.api_client.storeDraw(draw, `/${base_folder}/draw-history/${getFormattedToday()}.json`);
      await this.api_client.storeDraw(draw, `/${base_folder}/draw.json`);
      if (this.draw_helper.isBeforeCloseTime(draw)) {
        await this.api_client.storeDraw(draw, `/${base_folder}/draw-before-deadline.json`);
      }
    }
  }

  public async getDraw(_draw_number?: number): Promise<SvenskaSpelDraw | undefined> {
    console.warn('getDraw() is not yet implemented, dropbox-store');
    return undefined;
  }

  public async storeResult(result: SvenskaSpelResult): Promise<void> {
    const base_folder = this.getBaseFolder(result);
    await this.api_client.storeResult(result, `/${base_folder}/result.json`);
  }

  private getBaseFolder(result: { drawNumber: number }) {
    return `/${this.game_type}/old/${result.drawNumber}`;
  }

  public async getResult(_draw_number?: number): Promise<SvenskaSpelResult | undefined> {
    throw new Error('not implemented');
  }

  public async storeBets(_lines: Line[], _draw_number: number): Promise<void> {
    throw new Error('not implemented');
  }
}
