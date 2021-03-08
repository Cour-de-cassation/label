import { computePagination } from './computePagination';

describe('computePagination', () => {
  it('should return the right number with an uncomplete page', () => {
    const rowPerPage = 3;

    const lastPage = computePagination(rowPerPage, 3);
    const secondPage = computePagination(rowPerPage, 1);

    expect(lastPage).toEqual({ start: 9, end: 12 });
    expect(secondPage).toEqual({ start: 3, end: 6 });
  });

  it('should return the right number with no uncomplete page', () => {
    const rowPerPage = 2;

    const paginatedResult = computePagination(rowPerPage, 3);

    expect(paginatedResult).toEqual({ start: 6, end: 8 });
  });
});
