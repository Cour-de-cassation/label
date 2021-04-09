import { range } from 'lodash';

export { computeDisplayedPages, generateDisplayedPages };

const MAX_PAGES_DISPLAYED = 7;

function computeDisplayedPages(currentPage: number, numberOfPages: number) {
  if (numberOfPages <= MAX_PAGES_DISPLAYED) {
    return generateDisplayedPages(range(numberOfPages));
  }
  if (currentPage < 4) {
    return generateDisplayedPages([...range(5), undefined, numberOfPages - 1]);
  }
  if (currentPage > numberOfPages - 5) {
    return generateDisplayedPages([0, undefined, ...range(numberOfPages - 5, numberOfPages)]);
  }
  return generateDisplayedPages([
    0,
    undefined,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    undefined,
    numberOfPages - 1,
  ]);
}

function generateDisplayedPages(displayedPageNumbers: Array<number | undefined>) {
  return displayedPageNumbers.map((displayedPageNumber) =>
    displayedPageNumber === undefined
      ? ({ kind: 'blank' } as const)
      : ({ kind: 'page', value: displayedPageNumber } as const),
  );
}
