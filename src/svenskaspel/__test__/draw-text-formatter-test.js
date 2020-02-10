import draw_formatter from '../draw-text-formatter'
import fs from 'fs-extra';

describe('draw-formatter', function () {
  let draw;

  beforeEach('load draw', async () => {
    const draws = await fs.readJson('./src/svenskaspel/__test__/fixtures/stryktipset/draw.json');
    draw = draws[0];
  });

  describe('should print draw name', () => {

    it('should return the string of the draw name', async () => {
      const baseStatsString = draw_formatter.getDrawName(draw);
      console.log(baseStatsString);
      baseStatsString.should.eql("Stryktips v. 2020-03");
    });

  });

  describe('getting turnover', () => {

    it('should return the turnover', async () => {
      const turnover = draw_formatter.getTurnover(draw);
      console.log(turnover);
      turnover.should.eql("4690727,00");
    });

  });

  describe('getting deadline', () => {

    it('should return the deadline', async () => {
      const baseStatsString = draw_formatter.getDeadline(draw);
      console.log(baseStatsString);
      baseStatsString.should.eql("2020-01-18T15:59:00+01:00");
    });

  });

});

