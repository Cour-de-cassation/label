import { bearerTokenHandler } from './bearerTokenHandler';
import { adminViewHandler, adminViews } from './adminViewHandler';
import { displayModeHandler } from './displayModeHandler';
import {
  treatedDocumentsStateHandler,
  treatedDocumentOrderByProperties,
  treatedDocumentFilterType,
} from './treatedDocumentsStateHandler';
import {
  untreatedDocumentsStateHandler,
  untreatedDocumentOrderByProperties,
  untreatedDocumentFilterType,
} from './untreatedDocumentsStateHandler';
import { userHandler } from './userHandler';

export { adminViews, treatedDocumentOrderByProperties, untreatedDocumentOrderByProperties, localStorage };

export type { treatedDocumentFilterType, untreatedDocumentFilterType };

const localStorage = {
  adminViewHandler,
  bearerTokenHandler,
  displayModeHandler,
  treatedDocumentsStateHandler,
  untreatedDocumentsStateHandler,
  userHandler,
};
