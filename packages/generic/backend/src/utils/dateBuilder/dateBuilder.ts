export { dateBuilder };

const dateBuilder = {
  daysAgo(days: number): number {
    const dateInSeveralDaysInThePast = new Date();
    dateInSeveralDaysInThePast.setDate(
      dateInSeveralDaysInThePast.getDate() - days,
    );

    return dateInSeveralDaysInThePast.getTime();
  },
};
