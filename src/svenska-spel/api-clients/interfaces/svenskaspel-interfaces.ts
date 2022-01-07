export interface SvenskaSpelApiDraws {
  error?: string;
  requestInfo: {
    elapsedTime: number;
    apiVersion: number;
    transportProcessTime?: number;
    backendProcessTime?: number;
    fgwRTT?: number;
    backendModuleProcessTime?: number;
    channel?: string;
  };
  requestId: string;
  sessionId?: string;
  deviceId: string;
  session?: string;
  sessionUser?: string;
  clientInfo?: string;
  draws: SvenskaSpelDraw[];
}
export interface SvenskaSpelApiDraw extends Omit<SvenskaSpelApiDraws, 'draws'> {
  draw: SvenskaSpelDraw;
}
export interface SvenskaSpelDraw {
  drawComment: string;
  extraInfo?: string;
  fund?: string;
  events: SvenskaSpelEvent[];
  productName: string;
  productId: number;
  drawNumber: number;
  openTime: Date;
  closeTime: Date;
  turnover: string;
  sport: 'Fotboll';
  sportId: number;
  jackpotItems: JackpotItem[];
  checksum: string;
}
interface JackpotItem {
  description: 'Stryktipset';
  amount: string;
}
export interface SvenskaSpelEvent {
  eventNumber: number;
  description: string;
  cancelled: boolean;
  extraInfo?: string;
  eventTypeDescription: string;
  participantType: string;
  outcomes?: string;
  odds: {
    home: string;
    draw: string;
    away: string;
    date?: Date;
    refDate?: Date;
  };
  distribution: {
    home: string;
    draw: string;
    away: string;
    date: Date;
    refHome: string;
    refDraw: string;
    refAway: string;
    refDate: Date;
  };
  newspaperAdvice: {
    home: string;
    draw: string;
    away: string;
    date?: Date;
    refDate?: Date;
  };
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
  participants: [
    {
      id: number;
      type: 'home' | 'away';
      name: string;
    },
    {
      id: number;
      type: 'home' | 'away';
      name: string;
    },
  ];
  sportEventId: number;
  sportEventStart: Date;
  sportEventStatus: string;
  favouriteOdds: {
    home: number;
    draw: number;
    away: number;
  };
  startOdds: {
    home: string;
    draw: string;
    away: string;
  };
}
