import drawCleaner from '../draw-cleaner'
import drawBetValueRater from '../bet-calculations/draw-bet-value-rater'
import fs from 'fs-extra';

describe('draw-bet-value-rater', function () {
  let clean_draw;

  beforeEach('load draw', async () => {
    const draws = await fs.readJson('./src/svenskaspel/__test__/fixtures/stryktipset/draw.json');
    const draw = draws.draws[0];
    clean_draw = drawCleaner.cleanDraw(draw);
  });

  describe('bet value rater', () => {

    it('should rate bet values', async () => {
      const cleanDrawWithRates = drawBetValueRater.calculateRates(clean_draw);
      console.log(JSON.stringify(cleanDrawWithRates, null, "  "));
    });

  });

});

