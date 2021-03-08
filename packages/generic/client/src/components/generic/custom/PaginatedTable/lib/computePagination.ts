export { computePagination };

function computePagination(rowPerPage: number, page: number) {
  const start = page * rowPerPage;
  const end = start + rowPerPage;
  return { start, end };
}
