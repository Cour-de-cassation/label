export { getNextMonthDate };

function getNextMonthDate(date: Date) {
  const month = date.getMonth();
  const year = date.getFullYear();
  const nextMonthDate = new Date();
  if (month === 11) {
    nextMonthDate.setMonth(0);
    nextMonthDate.setFullYear(year + 1);
  } else {
    nextMonthDate.setMonth(month + 1);
    nextMonthDate.setFullYear(year);
  }
  return nextMonthDate;
}
