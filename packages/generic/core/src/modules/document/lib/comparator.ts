import { documentType } from '../documentType';

export { comparator };

const comparator = {
  compareByPriority(document1: documentType, document2: documentType) {
    return document2.priority - document1.priority;
  },
};
