import drawCleaner from '../draw-cleaner'
// import drawBetValueRater from '../bet-calculations/event-property-normalizer'
import drawBetCombinationGenerator from '../combinations/draw-bet-combination-generator'
import fs from 'fs-extra';

describe.skip('draw-bet-combination-generator', function () {
  let clean_draw;

  beforeEach(async () => {
    const draws = await fs.readJson('./src/svenskaspel/__tests__/fixtures/stryktipset/draw.json');
    const draw = draws.draws[0];
    clean_draw = drawCleaner.massageData(draw);
//    clean_draw_with_value_rates = drawBetValueRater.calculateRates(clean_draw.events)
  });
  afterEach(async () => {
    await fs.writeJson('./src/svenskaspel/__tests__/fixtures/combinations.json', combinations, {spaces: 2, EOL: '\n'});
  });

  describe('combination generator', () => {

    it('should generate combinations', async () => {
      // this.timeout(25000);
      const combinations = drawBetCombinationGenerator.generateAllCombinations(clean_draw);
      expect(combinations.length).toBe(1000);
    });

  });

});

