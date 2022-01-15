/*
import { FinalBets, generateLinesForDraw } from '../../analyze/analyze-draw';
import { DrawConfigV1 } from '../../analyze/draw-config';
import { verifyBetsWithResults } from '../../analyze/verifyt-ongoing-draw';

const main = async function () {
  const GAME_TYPE = 'stryktipset';
  const NUMBER_OF_LINES = 150;
  const draws = [{ number: 4645, correct_results: ['X', '2', '1', 'X', '2', '2', 'X', '2', '1', '1', '1', '1', '2'] }];

  let results: { number: number; number_of_focused_bets_to_align: number; maximum_number_of_corrects: number }[] = [];

  for (const draw of draws) {
    for (const number_of_focused_bets_to_align of [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]) {
      for (const bet_value_quota of [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3]) {
        for (const number_of_X_signs of [0, 1, 2, 3]) {
          const drawConfig: DrawConfigV1 = {
            game_type: GAME_TYPE,
            number_of_lines_to_pick: NUMBER_OF_LINES,
            number_of_focused_bets_to_align,
            bet_value_quota,
            number_of_X_signs,
          };
          const generated_lines: FinalBets = await generateLinesForDrawV1(drawConfig, draw.number);
          const maximum_number_of_corrects: number = await verifyBetsWithResults(
            GAME_TYPE,
            draw.correct_results,
            generated_lines.json,
          );
          results.push({
            number: draw.number,
            number_of_focused_bets_to_align,
            maximum_number_of_corrects,
          });
        }
      }
    }
  }
  results = results.filter((result) => result.maximum_number_of_corrects > 0);
  results = results.sort((result_a, result_b) => result_a.maximum_number_of_corrects - result_b.maximum_number_of_corrects);

  console.log(`results: ${JSON.stringify(results, null, 2)}`);
};

(async () => {
  await main();
})().catch((e) => {
  console.log(`error, ${e}`);
});
*/
