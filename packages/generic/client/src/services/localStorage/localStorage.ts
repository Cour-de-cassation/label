import { bearerTokenHandler } from './bearerTokenHandler';
import { adminViewHandler, adminViews } from './adminViewHandler';
import { displayModeHandler } from './displayModeHandler';
import { userHandler } from './userHandler';
import { treatedDocumentFilterType, treatedDocumentFiltersHandler } from './treatedDocumentFiltersHandler';

export { adminViews, localStorage };

export type { treatedDocumentFilterType };

const localStorage = {
  adminViewHandler,
  bearerTokenHandler,
  displayModeHandler,
  treatedDocumentFiltersHandler,
  userHandler,
};
