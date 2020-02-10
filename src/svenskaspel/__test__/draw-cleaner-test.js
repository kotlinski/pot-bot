import draw_formatter from '../draw-cleaner'
import fs from 'fs-extra';

describe('draw-cleaner', function () {
  let draw;

  beforeEach('load draw', async () => {
    const draws = await fs.readJson('./src/svenskaspel/__test__/fixtures/stryktipset/draw.json');
    draw = draws.draws[0];
  });

  describe('clean the raw draw data', () => {

    it('should clean the draw data', async () => {
      const cleanDraw = draw_formatter.cleanDraw(draw);
      console.log(JSON.stringify(cleanDraw, null, "  "));
      cleanDraw.should.eql("Stryktips v. 2020-03");
    });

  });

});

