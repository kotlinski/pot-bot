import drawCleaner from '../../draw-cleaner'
import {generateLines} from '../../combinations/generate-lines-combinations';
import fs from 'fs-extra';

describe('draw-bet-combination-generator', function () {
  let clean_draw;
  let combinations;

  beforeEach(async () => {
    const draws = await fs.readJson('./src/svenskaspel/__tests__/fixtures/stryktipset/draw.json');
    const draw = draws.draws[0];
    clean_draw = drawCleaner.massageData(draw);
  });

  beforeEach(async () => {
    combinations = generateLines(clean_draw.events);
  });

  describe('combination generator', () => {

    it('should have 13 outcomes', async () => {
      expect(combinations[0].outcomes.length).toBe(13);
    });

    it('should generate combinations', async () => {
      expect(combinations[0].outcomes).toStrictEqual([
        'home',
        'home',
        'home',
        'home',
        'home',
        'home',
        'home',
        'home',
        'home',
        'home',
        'home',
        'home',
        'home',
      ]);
    });

  });

});

