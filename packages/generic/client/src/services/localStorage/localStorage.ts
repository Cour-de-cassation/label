import { bearerTokenHandler } from './bearerTokenHandler';
import { displayModeHandler } from './displayModeHandler';
import { userHandler } from './userHandler';
import { treatedDocumentFilterType, treatedDocumentFiltersHandler } from './treatedDocumentFiltersHandler';

export { localStorage };

export type { treatedDocumentFilterType };

const localStorage = {
  bearerTokenHandler,
  displayModeHandler,
  treatedDocumentFiltersHandler,
  userHandler,
};
