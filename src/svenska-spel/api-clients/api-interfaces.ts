import { HomeAwayDraw } from '../../svenskaspel/interfaces';

export interface ApiDraw {
  draw_comment: string;
  events: ApiEvent[];
  draw_number: number;
  open_time: Date;
  close_time: Date;
  turnover: string;
  jackpot_items: JackpotItem[];
}
interface JackpotItem {
  description: 'Stryktipset';
  amount: string;
}
export interface ApiEvent {
  event_number: number;
  description: string;
  cancelled: boolean;
  odds: HomeAwayDraw<string>;
  distribution: HomeAwayDraw<string>;
  newspaper_advice: HomeAwayDraw<string>;
  participants: ApiParticipant[];
  sport_event_start: Date;
  sport_event_status: string;
}

interface ApiParticipant {
  id: number;
  type: 'home' | 'away';
  name: string;
}
