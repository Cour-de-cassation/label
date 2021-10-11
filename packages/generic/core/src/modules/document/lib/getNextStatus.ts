import { documentType } from '../documentType';
import { publicationHandler } from './publicationHandler';

export { getNextStatus };

function getNextStatus({
  publicationCategory,
  status,
}: Pick<documentType, 'status' | 'publicationCategory'>): documentType['status'] {
  switch (status) {
    case 'loaded':
      return 'nlpAnnotating';
    case 'nlpAnnotating':
      return 'free';
    case 'free':
      return 'pending';
    case 'pending':
      return 'saved';
    case 'saved':
      return publicationHandler.mustBePublished(publicationCategory) ? 'toBePublished' : 'done';
    case 'rejected':
      return publicationHandler.mustBePublished(publicationCategory) ? 'toBePublished' : 'done';
    case 'toBePublished':
      return 'done';
    default:
      return status;
  }
}
