import draw_fetcher from '../draw-fetcher'
import fs from 'fs-extra';

describe('draw-formatter', function () {
  let draw;

  beforeEach('load draw', async () => {
    const draws = await fs.readJson('./src/svenskaspel/__tests__/fixtures/stryktipset/draw.json');
    draw = draws[0];
  });

  describe('should print draw name', () => {

    it('should return the string of the draw name', async () => {
      const draw = await draw_fetcher.fetchNextDraw();
      console.log(JSON.stringify(draw, null, 2));
    });

  });

});

