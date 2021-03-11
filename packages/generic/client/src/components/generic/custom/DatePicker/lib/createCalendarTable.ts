import { range } from 'lodash';

export { createCalendarTable };

const ONE_DAY = 24 * 3600 * 1000;

function createCalendarTable(year: number, month: number) {
  const calendarTable: (number | undefined)[][] = [];
  const daysOfMonth: Date[] = [];

  // Create the array of the days of the month
  const currentDateInMonth = new Date(year, month);
  currentDateInMonth.setDate(1);
  do {
    daysOfMonth.push(new Date(currentDateInMonth));
    currentDateInMonth.setTime(currentDateInMonth.getTime() + ONE_DAY);
  } while (currentDateInMonth.getMonth() === month);

  // Dispatch the days of the month in table starting on Monday
  let week: number[] = [];
  daysOfMonth.forEach((dayOfMonth) => {
    if (dayOfMonth.getDay() === 1) {
      if (week.length > 0) {
        calendarTable.push(week);
      }
      week = [dayOfMonth.getDate()];
    } else {
      week.push(dayOfMonth.getDate());
    }
  });
  if (week.length > 0) {
    calendarTable.push(week);
  }

  // Complete the first week with potential blank spaces
  const firstWeekEmptyDays = 7 - calendarTable[0].length;
  calendarTable[0] = [...range(firstWeekEmptyDays).map(() => undefined), ...calendarTable[0]];

  // Complete the last week with potential blank spaces
  const lastWeekIndex = calendarTable.length - 1;
  const lastWeekEmptyDays = 7 - calendarTable[lastWeekIndex].length;
  calendarTable[lastWeekIndex] = [...calendarTable[lastWeekIndex], ...range(lastWeekEmptyDays).map(() => undefined)];

  return calendarTable;
}
