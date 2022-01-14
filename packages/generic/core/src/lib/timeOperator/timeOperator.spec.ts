import { timeOperator } from './timeOperator';

describe('timeOperator', () => {
  describe('convertDurationToReadableDuration', () => {
    it('should return 0s for milliseconds < 1000', () => {
      expect(timeOperator.convertDurationToReadableDuration(900)).toBe('0s');
    });

    it('should return 14s for 14 seconds', () => {
      expect(timeOperator.convertDurationToReadableDuration(14000)).toBe('14s');
    });

    it(`should return 10m2s" for 602 seconds`, () => {
      expect(timeOperator.convertDurationToReadableDuration(602000)).toBe(`10m2s`);
    });

    it(`should return 2h6m40s" for 7600 seconds`, () => {
      expect(timeOperator.convertDurationToReadableDuration(7600000)).toBe(`2h6m40s`);
    });
  });

  describe('convertTimestampToReadableDate', () => {
    it('should return a date with the appropriate format', () => {
      const regex = new RegExp('[0-9]{2}/[0-9]{2}/[0-9]{4} [0-9]{2}:[0-9]{2}');

      const dateString = timeOperator.convertTimestampToReadableDate(1639308840000, true);

      expect(regex.test(dateString)).toBe(true);
    });
  });

  describe('compareDates', () => {
    it('should return -1 if the date 1 is older than date2 by days', () => {
      const date1 = { year: 2021, month: 11, dayOfMonth: 1 };
      const date2 = { year: 2021, month: 11, dayOfMonth: 2 };

      expect(timeOperator.compareDates(date1, date2)).toBe(-1);
    });

    it('should return -1 if the date 1 is older than date2 by days', () => {
      const date1 = { year: 2021, month: 11, dayOfMonth: 1 };
      const date2 = { year: 2021, month: 11, dayOfMonth: 2 };

      expect(timeOperator.compareDates(date1, date2)).toBe(-1);
    });

    it('should return 0 if the date 1 is equal to date2', () => {
      const date1 = { year: 2021, month: 11, dayOfMonth: 1 };
      const date2 = { year: 2021, month: 11, dayOfMonth: 1 };

      expect(timeOperator.compareDates(date1, date2)).toBe(0);
    });

    it('should return 1 if the date 1 is more recent than date2 by days', () => {
      const date1 = { year: 2021, month: 11, dayOfMonth: 2 };
      const date2 = { year: 2021, month: 11, dayOfMonth: 1 };

      expect(timeOperator.compareDates(date1, date2)).toBe(1);
    });

    it('should return 1 if the date 1 is more recent than date2 by year', () => {
      const date1 = { year: 2022, month: 0, dayOfMonth: 30 };
      const date2 = { year: 2021, month: 9, dayOfMonth: 28 };

      expect(timeOperator.compareDates(date1, date2)).toBe(1);
    });
  });

  describe('convertTimestampToDate', () => {
    it('should convert the timestamp into date', () => {
      // October 11th 2021
      const timestamp = 1633946945874;

      const date = timeOperator.convertTimestampToDate(timestamp);

      expect(date).toEqual({ year: 2021, month: 9, dayOfMonth: 11 });
    });
  });
});
