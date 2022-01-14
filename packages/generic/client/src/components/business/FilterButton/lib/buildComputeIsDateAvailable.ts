import { dateType, timeOperator } from '@label/core';

export { buildComputeIsDateAvailable };

function buildComputeIsDateAvailable(extremumAvailableDates: { max: number | undefined; min: number | undefined }) {
  return (date: dateType) => {
    if (!extremumAvailableDates.min && !extremumAvailableDates.max) {
      return false;
    }
    let filter = true;
    if (!!extremumAvailableDates.min) {
      const minDate = timeOperator.convertTimestampToDate(extremumAvailableDates.min);
      if (timeOperator.compareDates(minDate, date) > 0) {
        filter = false;
      }
    }
    if (!!extremumAvailableDates.max) {
      const maxDate = timeOperator.convertTimestampToDate(extremumAvailableDates.max);
      if (timeOperator.compareDates(date, maxDate) > 0) {
        filter = false;
      }
    }
    return filter;
  };
}
