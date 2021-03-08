export { computeNumberOfPages };

function computeNumberOfPages(resultsCount: number, rowPerPage: number) {
  return Math.floor(resultsCount / rowPerPage) + (resultsCount % rowPerPage > 0 ? 1 : 0);
}
