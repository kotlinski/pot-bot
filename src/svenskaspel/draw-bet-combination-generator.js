function gameStringToStringToChar(gameString) {
  if (gameString === 'home') {
    return '1';
  } else if (gameString === 'draw') {
    return 'X';
  } else if (gameString === 'away') {
    return '2';
  }
}


function createCombinationObject(events, game1, game2, game3, game4, game5, game6, game7, game8, game9, game10, game11, game12, game13) {

  let odds_rate = 1;
  let bet_value_rate = 1;

  let index = 1;
  events.forEach(game => {
    bet_value_rate *= game.bet_value_rate[eval(`game${index}`)];
    odds_rate *= game.odds_rate[eval(`game${index}`)];
    index++;
  });

  const line_id = [];
  for (let game_index = 1; game_index < 14; game_index++) {
    line_id.push(`${gameStringToStringToChar(eval(`game${game_index}`))}`);
  }
  return {
    id: 'E,' + line_id.join(','),
    odds_rate: odds_rate,
    bet_value_rate: bet_value_rate
  };
}

const api = {

  generateAllCombinations: function (clean_draw_with_value_rates) {

    const combinations = [];

    const games = [];
    for (let game_index = 0; game_index < 13; game_index++) {
      games.push(`game${game_index}`);
    }

    console.log("Analyzing combinations");
    for (const game1 of ['home', 'draw', 'away']) {
      for (const game2 of ['home', 'draw', 'away']) {
        for (const game3 of ['home', 'draw', 'away']) {
          for (const game4 of ['home', 'draw', 'away']) {
            for (const game5 of ['home', 'draw', 'away']) {
              for (const game6 of ['home', 'draw', 'away']) {
                for (const game7 of ['home', 'draw', 'away']) {
                  for (const game8 of ['home', 'draw', 'away']) {
                    for (const game9 of ['home', 'draw', 'away']) {
                      for (const game10 of ['home', 'draw', 'away']) {
                        for (const game11 of ['home', 'draw', 'away']) {
                          for (const game12 of ['home', 'draw', 'away']) {
                            for (const game13 of ['home', 'draw', 'away']) {
                              combinations.push(createCombinationObject(clean_draw_with_value_rates.events, game1, game2, game3, game4, game5, game6, game7, game8, game9, game10, game11, game12, game13));
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return combinations;
    /*  console.log("sorting odds...");
      const sorted_on_probability = combinations.sort((a, b) => {
        return b.odds_rate - a.odds_rate;
      });

      console.log("");
      console.log("---Top 10 odds---");
      for (let i = 0; i < 10; i++) {
        const combination = sorted_on_probability[i];
        console.log(`${combination.id}: ${combination.odds_rate}`);
      }

      console.log("sorting valuable bets...");
      const sorted_on_bet_value = combinations.sort((a, b) => {
        return b.bet_value_rate - a.bet_value_rate;
      });

      console.log("Top 10 bet value");
      for (let i = 0; i < 10; i++) {
        const combination = sorted_on_bet_value[i];
        console.log(`${combination.id}: ${combination.bet_value_rate}`);
      }*/
  }
};

export default api;
