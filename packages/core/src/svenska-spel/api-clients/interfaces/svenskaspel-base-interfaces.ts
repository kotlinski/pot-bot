export interface SvenskaSpelApiResponse {
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
}

export interface SvenskaSpelResponseData {
  productName: string;
  productId: number;
  drawNumber: number;
  openTime: Date;
  closeTime: Date;
  turnover: string;
  sport?: 'Fotboll';
  sportId: number;
  jackpotItems?: JackpotItem[];
  checksum: string;
}
interface JackpotItem {
  description: 'Stryktipset' | 'Europatipset';
  amount: string;
}
export interface SvenskaSpelEvent {
  eventNumber: number;
  description: string;
  cancelled: boolean;
}
