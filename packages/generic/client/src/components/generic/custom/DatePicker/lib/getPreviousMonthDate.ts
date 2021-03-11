export { getPreviousMonthDate };

function getPreviousMonthDate(date: Date) {
  const month = date.getMonth();
  const year = date.getFullYear();
  const previousMonthDate = new Date(date);
  if (month === 0) {
    previousMonthDate.setFullYear(year - 1);
    previousMonthDate.setMonth(11);
  } else {
    previousMonthDate.setMonth(month - 1);
  }
  return previousMonthDate;
}
