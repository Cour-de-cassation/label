import { buildDateBuilder } from './dateBuilder';

describe('dateBuilder', () => {
  const dateBuilder = buildDateBuilder(() => new Date('2012-07-14T14:00:00.000Z'));

  describe('daysAgo', () => {
    it('should return the date in the given days ago', () => {
      const days = 15;

      const dateAgo = dateBuilder.daysAgo(days);

      expect(dateAgo).toEqual(new Date('2012-06-29T14:00:00.000Z').getTime());
    });
  });

  describe('minutesAgo', () => {
    it('should return the date in the given minutes ago', () => {
      const minutes = 15;

      const dateAgo = dateBuilder.minutesAgo(minutes);

      expect(dateAgo).toEqual(new Date('2012-07-14T13:45:00.000Z').getTime());
    });
  });

  describe('monthsAgo', () => {
    it('should return the date in the given months ago', () => {
      const months = 2;

      const dateAgo = dateBuilder.monthsAgo(months);

      expect(dateAgo).toEqual(new Date('2012-05-14T14:00:00.000Z').getTime());
    });
  });
});
