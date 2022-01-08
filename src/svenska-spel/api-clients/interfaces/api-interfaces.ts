import { HomeAwayDraw, Outcome } from '../../interfaces';

interface ApiBase {
  draw_number: number;
  open_time: Date;
  close_time: Date;
  turnover: string;
  jackpot_items?: JackpotItem[];
}
export interface ApiDraw extends ApiBase {
  draw_comment: string;
  events: ApiDrawEvent[];
}
export interface ApiResult extends ApiBase {
  cancelled: boolean;
  distribution: ApiWinnerDistribution[];
  events: ApiResultEvent[];
}
interface JackpotItem {
  description: 'Stryktipset' | 'Europatipset';
  amount: string;
}
export interface ApiEvent {
  event_number: number;
  description: string;
  cancelled: boolean;
}
export interface ApiDrawEvent extends ApiEvent {
  odds?: HomeAwayDraw<string>;
  distribution: HomeAwayDraw<string>;
  newspaper_advice?: HomeAwayDraw<string>;
  participants: ApiParticipant[];
  sport_event_start: Date;
  sport_event_status: string;
}
export interface ApiResultEvent extends ApiEvent {
  event_comment: string;
  outcome: Outcome;
  outcome_score: string;
}

interface ApiParticipant {
  id: number;
  type: 'home' | 'away';
  name: string;
}

export interface ApiWinnerDistribution {
  winners: number;
  amount: number;
  name: string;
  number_of_correct: number;
}
