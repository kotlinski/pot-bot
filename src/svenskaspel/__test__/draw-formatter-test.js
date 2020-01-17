import draw_formatter from '../draw-formatter'
import fs from 'fs-extra';

describe('draw-formatter', function () {
  let draw;

  beforeEach('load draw', async () => {
    draw = await fs.readJson('draws/draw.json');
  });

  describe('should print draw', () => {

    it('should return true if the phone is unlocked', async () => {
      const baseStatsString = draw_formatter.printBaseStats(draw);
      console.log(baseStatsString);
      baseStatsString.should.eql("abvs s");

    });

  });

});

