import { getFormattedToday } from '../formatter';

describe('formatter', () => {
  describe('getFormattedToday', function () {
    it('should format to a swedish time', () => {
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01').getTime());
      const formatted_today = getFormattedToday();
      expect(formatted_today).toEqual('20200101T0100');
    });
  });
});
