export {convertMillisecondsToReadableTime}

function convertMillisecondsToReadableTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60)
  const readableMinutes = totalMinutes >= 10 ? `${totalMinutes}`  : `0${totalMinutes}`;
  const remainingSeconds = totalSeconds % 60 >= 10 ? `${totalSeconds % 60}` : `0${totalSeconds % 60}`;
  if(readableMinutes === '00') {
    return `${remainingSeconds}"`
  }
  return `${readableMinutes}'${remainingSeconds}"`;
}
