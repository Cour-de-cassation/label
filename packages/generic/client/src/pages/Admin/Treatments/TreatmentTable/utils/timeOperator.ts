export { timeOperator };

const timeOperator = {
  convertDurationToReadableDuration,
  getReadableAverageDuration,
  getReadableTotalDuration,
};

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

function getReadableAverageDuration(durations: number[]) {
  if (!durations.length) {
    return convertDurationToReadableDuration(0);
  }
  const totalDuration = durations.reduce((total, duration) => total + duration, 0);
  const averageDuration = Math.floor(totalDuration / durations.length);
  return convertDurationToReadableDuration(averageDuration);
}

function getReadableTotalDuration(durations: number[]) {
  const totalDuration = durations.reduce((total, duration) => total + duration, 0);
  return convertDurationToReadableDuration(totalDuration);
}
