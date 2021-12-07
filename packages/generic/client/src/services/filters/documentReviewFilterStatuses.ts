import { documentType } from '@label/core';

export { documentReviewFilterStatuses, convertDocumentReviewStatusToFilter };

const documentReviewFilterStatuses = ['none', 'viewed', 'amended'] as const;

function convertDocumentReviewStatusToFilter(documentReviewStatus: documentType['reviewStatus']) {
  if (documentReviewStatus.hasBeenAmended) {
    return 'amended';
  }
  if (documentReviewStatus.viewerNames.length > 0) {
    return 'viewed';
  }
  return 'none';
}
