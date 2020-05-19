function calculateSortScore(game, i) {
  return game.odds_rate * (1 - i) + game.bet_value_rate * i;
}

function sortOnHighestBestScore(combinations) {
  const lines_to_pick = [];

  const sort = combinations.sort((a, b) => {
    // opposite b to a if doing a.total_odds / getting lowest odds as possible
    return b.bet_score - a.bet_score;
  });
  for (let i = 0; i < 300; i++) {
    lines_to_pick.push(sort[i]);
  }
  return lines_to_pick;
}

const api = {
  sortOnBestOdds: function (combinations) {
    return combinations.sort((a, b) => {
      return a.total_odds - b.total_odds;
    });
  },
  pickBets: function (combinations) {
    return sortOnHighestBestScore(combinations);
  }
};

export default api;

/*    for (let i = 0; i < 1.05; i += 0.1) {
      i = Math.round(i * 100) / 100;
      const sort = combinations.sort((a, b) => {
        return calculateSortScore(b, i) - calculateSortScore(a, i);
      });
      for (let i = 0; i < 10; i++) {
        lines_to_pick.push(sort[i]);
      }
      combinations = combinations.filter((el) => !lines_to_pick.includes(el));
    }*/
