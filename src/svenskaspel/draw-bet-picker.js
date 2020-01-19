import fs from "fs-extra";

function calculateSortScore(game, i) {
  return game.odds_rate * (1 - i) + game.bet_value_rate * i;
}

const api = {

  pickBets: function (combinations) {

    const lines_to_pick = [];
    for (let i = 0; i < 1.05; i += 0.1) {
      i = Math.round(i * 100) / 100;
      const sort = combinations.sort((a, b) => {
        return calculateSortScore(b, i) - calculateSortScore(a, i);
      });
      for (let i = 0; i < 10; i++) {
        lines_to_pick.push(sort[i]);
      }
      combinations = combinations.filter((el) => !lines_to_pick.includes(el));
    }
    return lines_to_pick;

  }
};

export default api;
