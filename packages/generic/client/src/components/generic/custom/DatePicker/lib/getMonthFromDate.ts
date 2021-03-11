export { getMonthFromDate };

function getMonthFromDate(date: Date) {
  const month = date.getMonth();
  if (month < 9) {
    return `0${month + 1}`;
  }
  return `${month + 1}`;
}
