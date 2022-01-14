import { getNextMonthDate } from './getNextMonthDate';

describe('getNextMonthDate', () => {
  it('should get the next month if we are in the middle of the year', () => {
    const date = new Date(2021, 2, 14);

    const nextMonthDate = getNextMonthDate(date);

    expect(nextMonthDate.getMonth()).toBe(3);
    expect(nextMonthDate.getFullYear()).toBe(2021);
  });

  it('should get the next month if we are at the end of the year', () => {
    const date = new Date(2021, 11, 2);

    const nextMonthDate = getNextMonthDate(date);

    expect(nextMonthDate.getMonth()).toBe(0);
    expect(nextMonthDate.getFullYear()).toBe(2022);
  });

  it('should get the next month if we are almost at the end of the year', () => {
    const date = new Date(2021, 10, 13);

    const nextMonthDate = getNextMonthDate(date);

    expect(nextMonthDate.getMonth()).toBe(11);
    expect(nextMonthDate.getFullYear()).toBe(2021);
  });
});
