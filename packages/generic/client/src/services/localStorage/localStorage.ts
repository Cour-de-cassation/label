import { bearerTokenHandler } from './bearerTokenHandler';
import { adminViewHandler, adminViews } from './adminViewHandler';
import { displayModeHandler } from './displayModeHandler';
import {
  publishableDocumentOrderByProperties,
  publishableDocumentsStateHandler,
} from './documentStateHandler/publishableDocumentsStateHandler';
import {
  treatedDocumentsStateHandler,
  treatedDocumentOrderByProperties,
  treatedDocumentFilterType,
} from './documentStateHandler/treatedDocumentsStateHandler';
import {
  untreatedDocumentsStateHandler,
  untreatedDocumentOrderByProperties,
  untreatedDocumentFilterType,
} from './documentStateHandler/untreatedDocumentsStateHandler';
import {
  toBeConfirmedDocumentFilterType,
  toBeConfirmedDocumentOrderByProperties,
  toBeConfirmedDocumentsStateHandler,
} from './documentStateHandler/toBeConfirmedDocumentsStateHandler';
import { userHandler } from './userHandler';

export {
  adminViews,
  publishableDocumentOrderByProperties,
  treatedDocumentOrderByProperties,
  untreatedDocumentOrderByProperties,
  toBeConfirmedDocumentOrderByProperties,
  localStorage,
};

export type { treatedDocumentFilterType, untreatedDocumentFilterType, toBeConfirmedDocumentFilterType };

const localStorage = {
  adminViewHandler,
  bearerTokenHandler,
  displayModeHandler,
  publishableDocumentsStateHandler,
  treatedDocumentsStateHandler,
  untreatedDocumentsStateHandler,
  toBeConfirmedDocumentsStateHandler,
  userHandler,
};
