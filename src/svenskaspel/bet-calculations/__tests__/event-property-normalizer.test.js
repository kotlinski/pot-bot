import {normalizeProperty} from '../../bet-calculations/event-property-normalizer'
import {EVENT_OUTCOME_TYPES} from '../../event-outcome-types'

describe('event-property-normalizer', function () {
  let events;

  describe('bet value rater', () => {
    events = [{
      home: {
        random_property: 20
      },
      draw: {
        random_property: 20
      },
      away: {
        random_property: 60
      },
    }, {
      home: {
        random_property: 24
      },
      draw: {
        random_property: 34
      },
      away: {
        random_property: 48
      },
    }];

    it('should have normalized values between 0 and 1', async () => {
      events = normalizeProperty(events, 'random_property');
      for (const event of events) {
        EVENT_OUTCOME_TYPES.forEach(outcome_type => {
          expect(event[outcome_type].random_property_normalized).toBeGreaterThanOrEqual(0);
          expect(event[outcome_type].random_property_normalized).toBeLessThanOrEqual(1);
        });
      }
    });

    it('should add a new normalized property', async () => {
      events = normalizeProperty(events, 'random_property');
      expect(events).toEqual([
        {
          "home": {
            "random_property": 20,
            "random_property_normalized": 0
          },
          "draw": {
            "random_property": 20,
            "random_property_normalized": 0
          },
          "away": {
            "random_property": 60,
            "random_property_normalized": 1
          }
        },
        {
          "home": {
            "random_property": 24,
            "random_property_normalized": 0.1
          },
          "draw": {
            "random_property": 34,
            "random_property_normalized": 0.35
          },
          "away": {
            "random_property": 48,
            "random_property_normalized": 0.7
          }
        }
      ]);
    });

  });

});

