import { documentType } from '../documentType';

export { comparator };

const comparator = {
  compareByPriority(document1: documentType, document2: documentType) {
    switch (document1.priority) {
      case 'low':
        switch (document2.priority) {
          case 'low':
            return 0;
          case 'medium':
          case 'high':
            return 1;
        }
      case 'medium':
        switch (document2.priority) {
          case 'low':
            return -1;
          case 'medium':
            return 0;
          case 'high':
            return 1;
        }
      case 'high':
        switch (document2.priority) {
          case 'low':
          case 'medium':
            return -1;
          case 'high':
            return 0;
        }
    }
  },
};
