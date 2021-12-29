import drawBetPicker from '../draw-bet-picker';
import fs from 'fs-extra';

describe.skip('draw-bet-combination-generator', function () {
  let combinations;

  beforeEach(async () => {
    combinations = await fs.readJson('./src/svenskaspel/__tests__/fixtures/combinations.json');
  });

  describe('combination generator', () => {
    it('should generate combinations', async () => {
      const picks = drawBetPicker.pickBetsV1(undefined, combinations);
    });
  });
});
