export { buildDateBuilder, dateBuilder };

const dateBuilder = buildDateBuilder(() => new Date());

function buildDateBuilder(now: () => Date) {
  return {
    daysAgo(days: number): number {
      const dateInSeveralDaysInThePast = now();
      dateInSeveralDaysInThePast.setDate(dateInSeveralDaysInThePast.getDate() - days);

      return dateInSeveralDaysInThePast.getTime();
    },

    minutesAgo(minutes: number): number {
      const dateInSeveralMinutesInThePast = now();

      dateInSeveralMinutesInThePast.setMinutes(dateInSeveralMinutesInThePast.getMinutes() - minutes);

      return dateInSeveralMinutesInThePast.getTime();
    },

    monthsAgo(months: number): number {
      const dateInSeveralMonthsInThePast = now();

      dateInSeveralMonthsInThePast.setMonth(dateInSeveralMonthsInThePast.getMonth() - months);

      return dateInSeveralMonthsInThePast.getTime();
    },
  };
}
