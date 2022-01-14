export { timeOperator };

export type { dateType };

type dateType = {
  year: number;
  month: number;
  dayOfMonth: number;
};

const timeOperator = {
  compareDates,
  convertDurationToReadableDuration,
  convertTimestampToReadableDate,
  convertTimestampToDate,
};

function convertTimestampToReadableDate(timestamp: number, displayTime?: boolean) {
  const date = new Date(timestamp);
  const readableDay = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
  const readableMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
  const readableYear = date.getFullYear();
  if (!displayTime) {
    return `${readableDay}/${readableMonth}/${readableYear}`;
  }

  const readableHours = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
  const readableMinutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;

  return `${readableDay}/${readableMonth}/${readableYear} ${readableHours}:${readableMinutes}`;
}

function convertDurationToReadableDuration(duration: number) {
  const totalSeconds = Math.floor(duration / 1000);
  const totalHours = Math.floor(totalSeconds / 3600);
  const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = Math.floor((totalSeconds % 3600) % 60);
  if (totalHours > 0) {
    return `${totalHours}h${remainingMinutes}m${remainingSeconds}s`;
  }
  if (remainingMinutes > 0) {
    return `${remainingMinutes}m${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
}

function compareDates(date1: dateType, date2: dateType) {
  if (date1.year < date2.year) {
    return -1;
  } else if (date1.year > date2.year) {
    return 1;
  }

  if (date1.month < date2.month) {
    return -1;
  } else if (date1.month > date2.month) {
    return 1;
  }

  if (date1.dayOfMonth < date2.dayOfMonth) {
    return -1;
  } else if (date1.dayOfMonth > date2.dayOfMonth) {
    return 1;
  }

  return 0;
}

function convertTimestampToDate(timestamp: number) {
  const date = new Date();
  date.setTime(timestamp);

  return { year: date.getFullYear(), month: date.getMonth(), dayOfMonth: date.getDate() };
}
