import { ApiResult, ApiResultEvent, ApiWinnerDistribution } from '../api-clients/interfaces/api-interfaces';
import { Outcome } from '../interfaces';
import {
  SvenskaSpelDistribution,
  SvenskaSpelResult,
  SvenskaSpelResultEvent,
} from '../api-clients/interfaces/svenskaspel-result-interfaces';

export function formatApiResult(result: SvenskaSpelResult): ApiResult {
  return {
    cancelled: result.cancelled,
    draw_number: result.drawNumber,
    open_time: result.openTime,
    close_time: result.closeTime,
    turnover: result.turnover,
    jackpot_items: result.jackpotItems,
    events: result.events.map(formatEvent),
    distribution: result.distribution.map(formatDistribution),
  };
}
function formatEvent(event: SvenskaSpelResultEvent): ApiResultEvent {
  return {
    event_number: event.eventNumber,
    description: event.description,
    cancelled: event.cancelled,
    event_comment: event.eventComment,
    outcome: formatOutcome(event.outcome),
    outcome_score: event.outcomeScore,
  };
}

function formatDistribution(distribution: SvenskaSpelDistribution): ApiWinnerDistribution {
  return {
    winners: distribution.winners,
    amount: parseInt(distribution.amount, 10),
    name: distribution.name,
    number_of_correct: parseInt(distribution.name, 10),
  };
}

function formatOutcome(outcome: '1' | 'X' | '2'): Outcome {
  switch (outcome) {
    case '1':
      return Outcome.HOME;
    case 'X':
      return Outcome.DRAW;
    case '2':
      return Outcome.AWAY;
  }
}
