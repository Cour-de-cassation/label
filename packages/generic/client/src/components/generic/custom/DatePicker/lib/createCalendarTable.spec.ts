import { createCalendarTable } from './createCalendarTable';

describe('createCalendarTable', () => {
  it('should create a table for month when the 1st is a Monday', () => {
    const year = 2021;
    const month = 2;

    const calendarTable = createCalendarTable(year, month);

    expect(calendarTable).toEqual([
      [1, 2, 3, 4, 5, 6, 7],
      [8, 9, 10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19, 20, 21],
      [22, 23, 24, 25, 26, 27, 28],
      [29, 30, 31, undefined, undefined, undefined, undefined],
    ]);
  });

  it('should create a table for month when the 1st is not a Monday', () => {
    const year = 2021;
    const month = 3;

    const calendarTable = createCalendarTable(year, month);

    expect(calendarTable).toEqual([
      [undefined, undefined, undefined, 1, 2, 3, 4],
      [5, 6, 7, 8, 9, 10, 11],
      [12, 13, 14, 15, 16, 17, 18],
      [19, 20, 21, 22, 23, 24, 25],
      [26, 27, 28, 29, 30, undefined, undefined],
    ]);
  });
});
