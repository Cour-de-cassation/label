import { computeNumberOfPages } from './computeNumberOfPages';

describe('computeNumberOfPages', () => {
  it('should return the right number with an uncomplete page', () => {
    const resultsCount = 10;
    const rowPerPage = 3;

    const numberOfPages = computeNumberOfPages(resultsCount, rowPerPage);

    expect(numberOfPages).toBe(4);
  });

  it('should return the right number with no uncomplete page', () => {
    const resultsCount = 12;
    const rowPerPage = 2;

    const numberOfPages = computeNumberOfPages(resultsCount, rowPerPage);

    expect(numberOfPages).toBe(6);
  });
});
