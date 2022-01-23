import { SvenskaSpelApiResponse, SvenskaSpelEvent, SvenskaSpelResponseData } from './svenskaspel-base-interfaces';

export interface SvenskaSpelApiResult extends SvenskaSpelApiResponse {
  result: SvenskaSpelResult;
}

export interface SvenskaSpelResult extends SvenskaSpelResponseData {
  cancelled: boolean;
  events: SvenskaSpelResultEvent[];
  distribution: SvenskaSpelDistribution[];
}

export interface SvenskaSpelResultEvent extends SvenskaSpelEvent {
  eventNumber: 1;
  eventComment: string;
  description: string;
  cancelled: boolean;
  outcome: '1' | 'X' | '2';
  outcomeScore: string;
}
export interface SvenskaSpelDistribution extends SvenskaSpelEvent {
  winners: number;
  amount: string;
  name: '13 rätt' | '12 rätt' | '11 rätt' | '10 rätt';
}
