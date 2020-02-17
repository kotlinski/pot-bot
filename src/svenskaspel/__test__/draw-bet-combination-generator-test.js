import drawCleaner from '../draw-cleaner'
import drawBetValueRater from '../bet-calculations/draw-bet-value-rater'
import drawBetCombinationGenerator from '../combinations/draw-bet-combination-generator'
import fs from 'fs-extra';

describe('draw-bet-combination-generator', function () {
  let clean_draw_with_value_rates;
  let combinations;

  beforeEach('load draw', async () => {
    const draws = await fs.readJson('./src/svenskaspel/__test__/fixtures/stryktipset/draw.json');
    const draw = draws.draws[0];
    const clean_draw = drawCleaner.cleanDraw(draw);
    clean_draw_with_value_rates = drawBetValueRater.calculateRates(clean_draw)
  });
  afterEach('store combinations', async () => {
    await fs.writeJson('./src/svenskaspel/__test__/fixtures/combinations.json', combinations, {spaces: 2, EOL: '\n'});
  });

  describe('combination generator', () => {

    it('should generate combinations', async () => {
      this.timeout(25000);
      combinations = drawBetCombinationGenerator.generateAllCombinations(clean_draw_with_value_rates);
    });

  });

});

