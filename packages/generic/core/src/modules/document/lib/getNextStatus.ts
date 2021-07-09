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
      const mustBePublished = publicationHandler.mustBePublished(publicationCategory);
      return mustBePublished ? 'toBePublished' : 'done';
    case 'toBePublished':
      return 'done';
    default:
      return status;
  }
}
