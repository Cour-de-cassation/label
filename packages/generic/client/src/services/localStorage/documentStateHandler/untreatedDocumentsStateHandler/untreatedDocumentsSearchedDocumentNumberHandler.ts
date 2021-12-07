import { localStorageHandler } from '../../localStorageHandler';
import { localStorageMappers } from '../../localStorageMappers';

export { getSearchedDocumentNumber, setSearchedDocumentNumber };

const UNTREATED_DOCUMENTS_SEARCHED_DOCUMENT_NUMBER_KEY = 'UNTREATED_DOCUMENTS_SEARCHED_DOCUMENT_NUMBER';

function getSearchedDocumentNumber() {
  return localStorageHandler.get({
    key: UNTREATED_DOCUMENTS_SEARCHED_DOCUMENT_NUMBER_KEY,
    mapper: localStorageMappers.integer,
  });
}

function setSearchedDocumentNumber(searchedDocumentNumber: number | undefined) {
  localStorageHandler.set({
    key: UNTREATED_DOCUMENTS_SEARCHED_DOCUMENT_NUMBER_KEY,
    value: searchedDocumentNumber,
    mapper: localStorageMappers.integer,
  });
}
