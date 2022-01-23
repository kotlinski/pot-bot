import DrawHelper from '../../svenska-spel/draw/draw-helper';
import { GameType } from '../../script/command-line-interfaces';
import { SvenskaSpelDraw } from '../../svenska-spel/api-clients/interfaces/svenskaspel-draw-interfaces';
import { Storage } from '../storage';
import { SvenskaSpelResult } from '../../svenska-spel/api-clients/interfaces/svenskaspel-result-interfaces';
import { Line } from '../../svenska-spel/interfaces';
import DropboxApiClient from '../../dropbox/dropbox-api-client';
import { getFormattedToday } from '../formatter';

export default class DropboxStore implements Storage {
  private readonly draw_helper: DrawHelper;
  private readonly api_client: DropboxApiClient;

  constructor(private readonly game_type: GameType, access_token: string) {
    this.draw_helper = new DrawHelper();
    this.api_client = new DropboxApiClient(access_token, game_type);
  }

  public async storeDraw(draw: SvenskaSpelDraw): Promise<void> {
    if (this.draw_helper.isCurrentDraw(draw)) {
      await this.api_client.storeDraw(draw, `/${this.game_type}/${draw.drawNumber}/${getFormattedToday()}.json`);
      await this.api_client.storeDraw(draw, `/${this.game_type}/${draw.drawNumber}/draw.json`);
    }
  }

  public async getDraw(_draw_number?: number): Promise<SvenskaSpelDraw | undefined> {
    console.warn('getDraw() is not yet implemented, dropbox-store');
    return undefined;
  }

  public async storeResult(_result: SvenskaSpelResult): Promise<void> {
    throw new Error('not implemented');
  }

  public async getResult(_draw_number?: number): Promise<SvenskaSpelResult | undefined> {
    throw new Error('not implemented');
  }

  public async storeBets(_lines: Line[], _draw_number: number): Promise<void> {
    throw new Error('not implemented');
  }
}
