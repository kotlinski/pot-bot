import fs from 'fs-extra';
import { convertToPercentage, convertDistributionToPercentage, convertOddsToFloatValues } from '../percentage-converter';

describe('distribution-to-percentage', function () {
  let odds;

  beforeEach(() => {
    odds = {
      home: '20',
      draw: '75',
      away: '5',
    };
  });

  it('should convert distributions to decimals', async () => {
    const percentage = convertDistributionToPercentage(odds);
    expect(percentage).toEqual({ home: 0.2, draw: 0.75, away: 0.05 });
  });
});

describe('convertOddsToFloats', function () {
  let odds;

  beforeEach(() => {
    odds = {
      home: '2,65',
      draw: '3,40',
      away: '2,95',
    };
  });

  it('should convert distributions to decimals', async () => {
    const float_odds = convertOddsToFloatValues(odds);
    expect(float_odds).toEqual({ home: 2.65, draw: 3.4, away: 2.95 });
  });
});

describe('odds-to-percentage', function () {
  let odds;

  describe('with even odds', () => {
    beforeEach(() => {
      odds = {
        home: '2',
        draw: '2',
        away: '2',
      };
    });
    it('should result in 1/3%', async () => {
      const percentage = convertToPercentage(odds);
      expect(percentage).toEqual({ home: 0.3333, draw: 0.3333, away: 0.3333 });
    });
  });

  describe('should respect decimals', () => {
    beforeEach(() => {
      odds = {
        home: '2.65',
        draw: '3.40',
        away: '2.95',
      };
    });

    it('should calculate percentage', async () => {
      const percentage = convertToPercentage(odds);
      expect(percentage).toEqual({ home: 0.3735, draw: 0.2911, away: 0.3355 });
    });

    it('should sum up to 100%', async () => {
      const percentage = convertToPercentage(odds);
      const sum = percentage.home + percentage.draw + percentage.away;
      expect(sum).toBeCloseTo(1, 0.001);
    });
  });

  describe('draws from fixture should sum up to 100%', () => {
    let draw;

    beforeEach(async () => {
      const draws = await fs.readJson('./src/svenskaspel/__tests__/fixtures/stryktipset/draw.json');
      draw = draws.draws[0];
    });

    it('should sum up to 100%', () => {
      draw.events.forEach((event) => {
        const percentage = convertToPercentage(event.odds);
        const sum = percentage.home + percentage.draw + percentage.away;
        expect(sum).toBeCloseTo(1, 0.001);
      });
    });
  });
});
