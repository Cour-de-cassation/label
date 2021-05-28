import { areSameDay } from './areSameDay';

describe('areSameDay', () => {
  it('should return true if the days are equal', () => {
    const date1 = new Date(2021, 2, 1, 13, 5, 0);
    const date2 = new Date(2021, 2, 1, 5, 11, 0);

    expect(areSameDay(date1, date2)).toBeTruthy();
  });
  it('should return false if the days are different', () => {
    const date1 = new Date(2021, 2, 1, 13, 5, 0);
    const date2 = new Date(2021, 2, 2, 13, 5, 0);

    expect(areSameDay(date1, date2)).toBeFalsy();
  });
});
