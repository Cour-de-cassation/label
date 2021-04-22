import { bearerTokenHandler } from './bearerTokenHandler';
import { adminViewHandler, adminViews } from './adminViewHandler';
import { displayModeHandler } from './displayModeHandler';
import {
  treatedDocumentsStateHandler,
  treatedDocumentOrderByProperties,
  treatedDocumentFilterType,
} from './treatedDocumentsStateHandler';
import { userHandler } from './userHandler';

export { adminViews, treatedDocumentOrderByProperties, localStorage };

export type { treatedDocumentFilterType };

const localStorage = {
  adminViewHandler,
  bearerTokenHandler,
  displayModeHandler,
  treatedDocumentsStateHandler,
  userHandler,
};
