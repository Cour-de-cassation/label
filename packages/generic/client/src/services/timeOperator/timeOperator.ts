export { timeOperator };

const timeOperator = {
  convertDurationToReadableDuration,
  convertTimestampToReadableDate,
};

function convertTimestampToReadableDate(timestamp: number) {
  const date = new Date(timestamp);
  const readableDay = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
  const readableMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
  const readableYear = date.getFullYear();
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
