export { incrementTreatmentDuration };

const DURATION_THRESHOLD_BETWEEN_TIMESTAMPS = 20 * 60 * 1000;

function incrementTreatmentDuration({
  previousTreatmentDuration,
  lastUpdateDate,
}: {
  previousTreatmentDuration: number;
  lastUpdateDate: number;
}) {
  const currentDate = new Date().getTime();

  return currentDate - lastUpdateDate < DURATION_THRESHOLD_BETWEEN_TIMESTAMPS
    ? currentDate - lastUpdateDate + previousTreatmentDuration
    : previousTreatmentDuration;
}
