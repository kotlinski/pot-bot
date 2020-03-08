import {getAllPossibleCombinations} from '../generate-all-possible-combinations'
import {EVENT_OUTCOME_TYPES} from "../../event-outcome-types";
import _ from 'lodash';

function randomOutcome() {
  return EVENT_OUTCOME_TYPES[Math.floor(Math.random() * 3)]
}

describe('getAllPossibleCombinations', function () {
  let combinations;

  beforeAll(() => {
    combinations = getAllPossibleCombinations();
  });

  it('should generate 3^13 combinations', async () => {
    expect(combinations.length).toBe(Math.pow(3, 13));
  });

  it('should only be one and exactly one of every combination', async () => {
    const random_combination = [];
    for (let i = 0; i < 13; i++) {
      random_combination.push(randomOutcome());
    }

    let found_combinations = combinations.filter(combination => {
      return _.isEqual(combination, random_combination);
    });
    expect(found_combinations.length).toEqual(1);
  });

});

