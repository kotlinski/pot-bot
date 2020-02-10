import draw_validator from '../draw-validator'
import moment from 'moment'
import fs from 'fs-extra';

describe('draw-formatter', function () {
  let draw;

  beforeEach('load draw', async () => {
    const draws = await fs.readJson('./src/svenskaspel/__test__/fixtures/stryktipset/draw.json');
    draw = draws.draws[0];
  });

  describe('has odds', () => {

    describe('13 games with odds', () => {
      it('should return true', async () => {
        const has_odds = draw_validator.hasOdds(draw);
        has_odds.should.eql(true);
      });
    });

    describe('one game missing odds', () => {
      beforeEach(() => {
        draw.events[10].odds = null;
      });

      it('should return false', async () => {
        const has_odds = draw_validator.hasOdds(draw);
        has_odds.should.eql(false);
      });
    });
  });

  describe('isCurrentDraw', () => {

    describe('a draw that is outdated', () => {
      it('should return false', async () => {
        const is_current_draw = draw_validator.isCurrentDraw(draw);
        is_current_draw.should.eql(false);
      });
    });

    describe('current draw', () => {

      beforeEach(() => {
        draw.closeTime = moment().add(1, "day").toISOString(true);
      });

      it('should return false', async () => {
        const is_current_draw = draw_validator.isCurrentDraw(draw);
        is_current_draw.should.eql(true);
      });
    });

  });

  describe('isCurrentDraw', () => {

    describe('a draw that is outdated', () => {
      it('should return false', async () => {
        const is_current_draw = draw_validator.isLastDay(draw);
        is_current_draw.should.eql(false);
      });
    });

    describe('current draw', () => {

      beforeEach(() => {
        draw.closeTime = moment().toISOString(true);
      });

      it('should return false', async () => {
        const is_current_draw = draw_validator.isLastDay(draw);
        is_current_draw.should.eql(true);
      });
    });

  })

});

