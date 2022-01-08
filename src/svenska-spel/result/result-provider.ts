import SvenskaSpelApiClient from '../api-clients/svenska-spel-api-client';
import { ApiResult } from '../api-clients/interfaces/api-interfaces';
import { formatApiResult } from './result-formatter';
import ResultStore from '../../storage/result-store';
import { SvenskaSpelResult } from '../api-clients/interfaces/svenskaspel-result-interfaces';

export default class ResultProvider {
  constructor(private readonly api_client: SvenskaSpelApiClient, private readonly result_store: ResultStore) {}

  public async getResult(draw_number?: number): Promise<ApiResult> {
    const result = await this.getSvenskaSpelResult(draw_number);
    return formatApiResult(result);
  }

  private async getSvenskaSpelResult(draw_number?: number): Promise<SvenskaSpelResult> {
    const stored_result = await this.result_store.getResult(draw_number);
    if (stored_result === undefined || !this.isComplete(stored_result)) {
      const result = await this.api_client.fetchResult(draw_number);
      await this.result_store.storeResult(result);
      return result;
    } else {
      return stored_result;
    }
  }

  private isComplete(result: SvenskaSpelResult): boolean {
    return result.events.reduce((is_complete: boolean, event) => is_complete && event.outcome !== undefined, true);
  }
}
