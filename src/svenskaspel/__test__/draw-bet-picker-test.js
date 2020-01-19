import drawBetPicker from '../draw-bet-picker'
import fs from 'fs-extra';

describe('draw-bet-combination-generator', function () {
  this.timeout(25000);
  let combinations;

  beforeEach('load draw', async () => {
    combinations = await fs.readJson('./src/svenskaspel/__test__/fixtures/combinations.json');
  });

  describe('combination generator', () => {

    it('should generate combinations', async () => {
      const picks = drawBetPicker.pickBets(combinations);
    });

  });

});

