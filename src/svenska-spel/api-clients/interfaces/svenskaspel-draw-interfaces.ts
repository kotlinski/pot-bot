import { SvenskaSpelApiResponse, SvenskaSpelEvent, SvenskaSpelResponseData } from './svenskaspel-base-interfaces';

export interface SvenskaSpelApiDraws extends SvenskaSpelApiResponse {
  draws: SvenskaSpelDraw[];
}

export interface SvenskaSpelApiDraw extends SvenskaSpelApiResponse {
  draw: SvenskaSpelDraw;
}

export interface SvenskaSpelDraw extends SvenskaSpelResponseData {
  drawComment: string;
  extraInfo?: string;
  fund?: string;
  events: SvenskaSpelDrawEvent[];
}

interface SvenskaSpelEventOutcome {
  home: string;
  draw: string;
  away: string;
  date?: Date;
  refHome?: string;
  refDraw?: string;
  refAway?: string;
  refDate?: Date;
}
interface SvenskaSpelParticipant {
  id: number;
  type: 'home' | 'away';
  name: string;
}

export interface SvenskaSpelDrawEvent extends SvenskaSpelEvent {
  extraInfo?: string;
  eventTypeDescription: string;
  participantType: string;
  outcomes?: string;
  odds?: SvenskaSpelEventOutcome;
  distribution: SvenskaSpelEventOutcome;
  newspaperAdvice?: SvenskaSpelEventOutcome;
  league: {
    id: number;
    name: string;
    season: {
      id: number;
      name: string;
    };
    country: {
      id: number;
      name: string;
    };
  };
  participants: SvenskaSpelParticipant[];
  sportEventId: number;
  sportEventStart: Date;
  sportEventStatus: string;
  favouriteOdds: SvenskaSpelEventOutcome;
  startOdds?: SvenskaSpelEventOutcome;
}
