import { getMonthFromDate } from './getMonthFromDate';

describe('getMonthFromDate', () => {
  it('should get the rightly formatted month if < 10', () => {
    const date = new Date(2021, 2, 1);

    const month = getMonthFromDate(date);

    expect(month).toBe('03');
  });

  it('should get the rightly formatted month if >= 10', () => {
    const date = new Date(2021, 11, 1);

    const month = getMonthFromDate(date);

    expect(month).toBe('12');
  });
});
