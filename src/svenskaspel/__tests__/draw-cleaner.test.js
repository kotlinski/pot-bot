import draw_cleaner from '../draw-cleaner'
import fs from 'fs-extra';

describe('draw-cleaner', function () {
  let draw;

  beforeEach(async () => {
    const draws = await fs.readJson('./src/svenskaspel/__tests__/fixtures/stryktipset/draw.json');
    draw = draws.draws[0];
  });

  describe('When the odds thinks the home team wins, but the people thinks that the away teams wins', () => {
    beforeEach(() => {
      draw.events = [
        {
          odds: {
            home: '1,00',
            draw: '2,00',
            away: '5,00',
          },
          distribution: {
            home: 20,
            draw: 20,
            away: 60,
          },
          "description": "Arsenal-Sheffield U",
          "eventNumber": 1
        },
      ];
    });
    it('should have a high bet value on the home team', () => {
      const cleanDraw = draw_cleaner.massageData(draw);
      expect(cleanDraw.events[0].home.bet_value_normalized).toBe(1);
    });
    it('should have a low bet value on the away team', () => {
      const cleanDraw = draw_cleaner.massageData(draw);
      expect(cleanDraw.events[0].away.bet_value_normalized).toBe(0);
    });
    it('should calculate bet value', () => {
      const cleanDraw = draw_cleaner.massageData(draw);
      expect(cleanDraw.events).toEqual([
        {
          "away": {
            "bet_value": 0.196,
            "bet_value_normalized": 0,
            "distribution_in_percentage": 0.6,
            "odds": 5,
            "odds_in_percentage": 0.1176,
            "odds_in_percentage_normalized": 0,
          },
          "description": "Arsenal-Sheffield U",
          "draw": {
            "bet_value": 1.4705,
            "bet_value_normalized": 0.4643,
            "distribution_in_percentage": 0.2,
            "odds": 2,
            "odds_in_percentage": 0.2941,
            "odds_in_percentage_normalized": 0.3751,
          },
          "home": {
            "bet_value": 2.941,
            "bet_value_normalized": 1,
            "distribution_in_percentage": 0.2,
            "odds": 1,
            "odds_in_percentage": 0.5882,
            "odds_in_percentage_normalized": 1,
          },
          "number": 1
        },
      ]);
    });
  });
  describe('clean the raw fixture draw data', () => {

    it('should clean the draw data', async () => {
      const cleanDraw = draw_cleaner.massageData(draw);
      expect(cleanDraw).toEqual(    {
            "turnover": 4690727,
            "name": "Stryktips v. 2020-03",
            "product": "Stryktipset",
            "productId": 1,
            "drawNumber": 4633,
            "openTime": "2020-01-12T07:00:00+01:00",
            "closeTime": "2020-01-18T15:59:00+01:00",
            "events": [
              {
                "number": 1,
                "description": "Arsenal-Sheffield U",
                "home": {
                  "odds": 1.83,
                  "odds_in_percentage": 0.5265,
                  "distribution_in_percentage": 0.58,
                  "bet_value": 0.9078,
                  "bet_value_normalized": 0.3732,
                  "odds_in_percentage_normalized": 0.5843
                },
                "draw": {
                  "odds": 3.65,
                  "odds_in_percentage": 0.264,
                  "distribution_in_percentage": 0.27,
                  "bet_value": 0.9778,
                  "bet_value_normalized": 0.4629,
                  "odds_in_percentage_normalized": 0.271
                },
                "away": {
                  "odds": 4.6,
                  "odds_in_percentage": 0.2095,
                  "distribution_in_percentage": 0.15,
                  "bet_value": 1.3967,
                  "bet_value_normalized": 1,
                  "odds_in_percentage_normalized": 0.2059
                }
              },
              {
                "number": 2,
                "description": "Manchester C-Crystal P",
                "home": {
                  "odds": 1.1,
                  "odds_in_percentage": 0.8747,
                  "distribution_in_percentage": 0.86,
                  "bet_value": 1.0171,
                  "bet_value_normalized": 0.5133,
                  "odds_in_percentage_normalized": 1
                },
                "draw": {
                  "odds": 10.9,
                  "odds_in_percentage": 0.0883,
                  "distribution_in_percentage": 0.08,
                  "bet_value": 1.1038,
                  "bet_value_normalized": 0.6245,
                  "odds_in_percentage_normalized": 0.0612
                },
                "away": {
                  "odds": 26,
                  "odds_in_percentage": 0.037,
                  "distribution_in_percentage": 0.06,
                  "bet_value": 0.6167,
                  "bet_value_normalized": 0,
                  "odds_in_percentage_normalized": 0
                }
              },
              {
                "number": 3,
                "description": "Newcastle-Chelsea",
                "home": {
                  "odds": 6.15,
                  "odds_in_percentage": 0.1574,
                  "distribution_in_percentage": 0.17,
                  "bet_value": 0.9259,
                  "bet_value_normalized": 0.3964,
                  "odds_in_percentage_normalized": 0.1437
                },
                "draw": {
                  "odds": 4.7,
                  "odds_in_percentage": 0.2059,
                  "distribution_in_percentage": 0.22,
                  "bet_value": 0.9359,
                  "bet_value_normalized": 0.4092,
                  "odds_in_percentage_normalized": 0.2016
                },
                "away": {
                  "odds": 1.52,
                  "odds_in_percentage": 0.6367,
                  "distribution_in_percentage": 0.61,
                  "bet_value": 1.0438,
                  "bet_value_normalized": 0.5476,
                  "odds_in_percentage_normalized": 0.7159
                }
              },
              {
                "number": 4,
                "description": "West Ham-Everton",
                "home": {
                  "odds": 3.02,
                  "odds_in_percentage": 0.3193,
                  "distribution_in_percentage": 0.33,
                  "bet_value": 0.9676,
                  "bet_value_normalized": 0.4499,
                  "odds_in_percentage_normalized": 0.337
                },
                "draw": {
                  "odds": 3.48,
                  "odds_in_percentage": 0.2771,
                  "distribution_in_percentage": 0.28,
                  "bet_value": 0.9896,
                  "bet_value_normalized": 0.4781,
                  "odds_in_percentage_normalized": 0.2866
                },
                "away": {
                  "odds": 2.39,
                  "odds_in_percentage": 0.4035,
                  "distribution_in_percentage": 0.39,
                  "bet_value": 1.0346,
                  "bet_value_normalized": 0.5358,
                  "odds_in_percentage_normalized": 0.4375
                }
              },
              {
                "number": 5,
                "description": "Southampton-Wolverhampton",
                "home": {
                  "odds": 2.36,
                  "odds_in_percentage": 0.4093,
                  "distribution_in_percentage": 0.46,
                  "bet_value": 0.8898,
                  "bet_value_normalized": 0.3501,
                  "odds_in_percentage_normalized": 0.4444
                },
                "draw": {
                  "odds": 3.4,
                  "odds_in_percentage": 0.2841,
                  "distribution_in_percentage": 0.28,
                  "bet_value": 1.0146,
                  "bet_value_normalized": 0.5101,
                  "odds_in_percentage_normalized": 0.295
                },
                "away": {
                  "odds": 3.15,
                  "odds_in_percentage": 0.3066,
                  "distribution_in_percentage": 0.26,
                  "bet_value": 1.1792,
                  "bet_value_normalized": 0.7212,
                  "odds_in_percentage_normalized": 0.3218
                }
              },
              {
                "number": 6,
                "description": "Brighton-Aston Villa",
                "home": {
                  "odds": 1.62,
                  "odds_in_percentage": 0.5957,
                  "distribution_in_percentage": 0.58,
                  "bet_value": 1.0271,
                  "bet_value_normalized": 0.5262,
                  "odds_in_percentage_normalized": 0.6669
                },
                "draw": {
                  "odds": 4.45,
                  "odds_in_percentage": 0.2169,
                  "distribution_in_percentage": 0.23,
                  "bet_value": 0.943,
                  "bet_value_normalized": 0.4183,
                  "odds_in_percentage_normalized": 0.2148
                },
                "away": {
                  "odds": 5.15,
                  "odds_in_percentage": 0.1874,
                  "distribution_in_percentage": 0.19,
                  "bet_value": 0.9863,
                  "bet_value_normalized": 0.4738,
                  "odds_in_percentage_normalized": 0.1795
                }
              },
              {
                "number": 7,
                "description": "Norwich-Bournemouth",
                "home": {
                  "odds": 2.22,
                  "odds_in_percentage": 0.434,
                  "distribution_in_percentage": 0.49,
                  "bet_value": 0.8857,
                  "bet_value_normalized": 0.3449,
                  "odds_in_percentage_normalized": 0.4739
                },
                "draw": {
                  "odds": 3.6,
                  "odds_in_percentage": 0.2677,
                  "distribution_in_percentage": 0.26,
                  "bet_value": 1.0296,
                  "bet_value_normalized": 0.5294,
                  "odds_in_percentage_normalized": 0.2754
                },
                "away": {
                  "odds": 3.23,
                  "odds_in_percentage": 0.2983,
                  "distribution_in_percentage": 0.25,
                  "bet_value": 1.1932,
                  "bet_value_normalized": 0.7391,
                  "odds_in_percentage_normalized": 0.3119
                }
              },
              {
                "number": 8,
                "description": "Birmingham-Cardiff",
                "home": {
                  "odds": 2.37,
                  "odds_in_percentage": 0.4011,
                  "distribution_in_percentage": 0.43,
                  "bet_value": 0.9328,
                  "bet_value_normalized": 0.4053,
                  "odds_in_percentage_normalized": 0.4346
                },
                "draw": {
                  "odds": 3.37,
                  "odds_in_percentage": 0.2821,
                  "distribution_in_percentage": 0.3,
                  "bet_value": 0.9403,
                  "bet_value_normalized": 0.4149,
                  "odds_in_percentage_normalized": 0.2926
                },
                "away": {
                  "odds": 3,
                  "odds_in_percentage": 0.3169,
                  "distribution_in_percentage": 0.27,
                  "bet_value": 1.1737,
                  "bet_value_normalized": 0.7141,
                  "odds_in_percentage_normalized": 0.3341
                }
              },
              {
                "number": 9,
                "description": "Derby-Hull",
                "home": {
                  "odds": 2.55,
                  "odds_in_percentage": 0.3724,
                  "distribution_in_percentage": 0.51,
                  "bet_value": 0.7302,
                  "bet_value_normalized": 0.1455,
                  "odds_in_percentage_normalized": 0.4004
                },
                "draw": {
                  "odds": 3.32,
                  "odds_in_percentage": 0.286,
                  "distribution_in_percentage": 0.24,
                  "bet_value": 1.1917,
                  "bet_value_normalized": 0.7372,
                  "odds_in_percentage_normalized": 0.2972
                },
                "away": {
                  "odds": 2.78,
                  "odds_in_percentage": 0.3416,
                  "distribution_in_percentage": 0.25,
                  "bet_value": 1.3664,
                  "bet_value_normalized": 0.9612,
                  "odds_in_percentage_normalized": 0.3636
                }
              },
              {
                "number": 10,
                "description": "Huddersfield-Brentford",
                "home": {
                  "odds": 5.1,
                  "odds_in_percentage": 0.1865,
                  "distribution_in_percentage": 0.2,
                  "bet_value": 0.9325,
                  "bet_value_normalized": 0.4049,
                  "odds_in_percentage_normalized": 0.1785
                },
                "draw": {
                  "odds": 3.65,
                  "odds_in_percentage": 0.2606,
                  "distribution_in_percentage": 0.22,
                  "bet_value": 1.1845,
                  "bet_value_normalized": 0.7279,
                  "odds_in_percentage_normalized": 0.2669
                },
                "away": {
                  "odds": 1.72,
                  "odds_in_percentage": 0.5529,
                  "distribution_in_percentage": 0.58,
                  "bet_value": 0.9533,
                  "bet_value_normalized": 0.4315,
                  "odds_in_percentage_normalized": 0.6159
                }
              },
              {
                "number": 11,
                "description": "Millwall-Reading",
                "home": {
                  "odds": 2.19,
                  "odds_in_percentage": 0.4341,
                  "distribution_in_percentage": 0.5,
                  "bet_value": 0.8682,
                  "bet_value_normalized": 0.3224,
                  "odds_in_percentage_normalized": 0.474
                },
                "draw": {
                  "odds": 3.23,
                  "odds_in_percentage": 0.2943,
                  "distribution_in_percentage": 0.28,
                  "bet_value": 1.0511,
                  "bet_value_normalized": 0.5569,
                  "odds_in_percentage_normalized": 0.3072
                },
                "away": {
                  "odds": 3.5,
                  "odds_in_percentage": 0.2716,
                  "distribution_in_percentage": 0.22,
                  "bet_value": 1.2345,
                  "bet_value_normalized": 0.7921,
                  "odds_in_percentage_normalized": 0.2801
                }
              },
              {
                "number": 12,
                "description": "Preston-Charlton",
                "home": {
                  "odds": 1.54,
                  "odds_in_percentage": 0.6193,
                  "distribution_in_percentage": 0.67,
                  "bet_value": 0.9243,
                  "bet_value_normalized": 0.3944,
                  "odds_in_percentage_normalized": 0.6951
                },
                "draw": {
                  "odds": 4.25,
                  "odds_in_percentage": 0.2244,
                  "distribution_in_percentage": 0.2,
                  "bet_value": 1.122,
                  "bet_value_normalized": 0.6478,
                  "odds_in_percentage_normalized": 0.2237
                },
                "away": {
                  "odds": 6.1,
                  "odds_in_percentage": 0.1563,
                  "distribution_in_percentage": 0.13,
                  "bet_value": 1.2023,
                  "bet_value_normalized": 0.7508,
                  "odds_in_percentage_normalized": 0.1424
                }
              },
              {
                "number": 13,
                "description": "Sheffield W-Blackburn",
                "home": {
                  "odds": 1.77,
                  "odds_in_percentage": 0.5387,
                  "distribution_in_percentage": 0.65,
                  "bet_value": 0.8288,
                  "bet_value_normalized": 0.2719,
                  "odds_in_percentage_normalized": 0.5989
                },
                "draw": {
                  "odds": 3.55,
                  "odds_in_percentage": 0.2686,
                  "distribution_in_percentage": 0.21,
                  "bet_value": 1.279,
                  "bet_value_normalized": 0.8491,
                  "odds_in_percentage_normalized": 0.2765
                },
                "away": {
                  "odds": 4.95,
                  "odds_in_percentage": 0.1926,
                  "distribution_in_percentage": 0.14,
                  "bet_value": 1.3757,
                  "bet_value_normalized": 0.9731,
                  "odds_in_percentage_normalized": 0.1857
                }
              }
            ]
          }
      );
    });

  });

});

