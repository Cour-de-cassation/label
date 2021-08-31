import { bearerTokenHandler } from './bearerTokenHandler';
import { adminViewHandler, adminViews } from './adminViewHandler';
import { displayModeHandler } from './displayModeHandler';
import {
  publishableDocumentOrderByProperties,
  publishableDocumentsStateHandler,
} from './publishableDocumentsStateHandler';
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

export {
  adminViews,
  publishableDocumentOrderByProperties,
  treatedDocumentOrderByProperties,
  untreatedDocumentOrderByProperties,
  localStorage,
};

export type { treatedDocumentFilterType, untreatedDocumentFilterType };

const localStorage = {
  adminViewHandler,
  bearerTokenHandler,
  displayModeHandler,
  publishableDocumentsStateHandler,
  treatedDocumentsStateHandler,
  untreatedDocumentsStateHandler,
  userHandler,
};
