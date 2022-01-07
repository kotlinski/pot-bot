/*
import draw_formatter from '../draw-text-formatter';
import fs from 'fs-extra';

describe('draw-formatter', function () {
  let draw;

  beforeEach(async () => {
    const draws = await fs.readJson('./src/svenskaspel/__tests__/fixtures/stryktipset/draw.json');
    draw = draws.draws[0];
  });

  describe('should print draw name', () => {
    it('should return the string of the draw name', () => {
      const baseStatsString = draw_formatter.getDrawName(draw);
      expect(baseStatsString).toBe('Stryktips v. 2020-03');
    });
  });

  describe('getting turnover', () => {
    it('should return the turnover', () => {
      const turnover = draw_formatter.getTurnover(draw);
      console.log(turnover);
      expect(turnover).toBe(
        'turnover: 4,690,727 SEK\n' +
          '\'13\': 1,876,290.8 SEK\n' +
          '\'12\': 703,609.05 SEK\n' +
          '\'11\': 562,887.24 SEK\n' +
          '\'10\': 1,172,681.75 SEK\n',
      );
    });
  });

  describe('getting deadline', () => {
    it('should return the deadline', () => {
      const baseStatsString = draw_formatter.getDeadline(draw);
      console.log(baseStatsString);
      expect(baseStatsString).toBe('2020-01-18T15:59:00+01:00');
    });
  });
});*/
