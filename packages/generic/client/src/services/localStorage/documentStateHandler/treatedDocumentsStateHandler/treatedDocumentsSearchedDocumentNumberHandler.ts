import { localStorageHandler } from '../../localStorageHandler';
import { localStorageMappers } from '../../localStorageMappers';

export { getSearchedDocumentNumber, setSearchedDocumentNumber };

const TREATED_DOCUMENTS_SEARCHED_DOCUMENT_NUMBER_KEY = 'TREATED_DOCUMENTS_SEARCHED_DOCUMENT_NUMBER';

function getSearchedDocumentNumber() {
  return localStorageHandler.get({
    key: TREATED_DOCUMENTS_SEARCHED_DOCUMENT_NUMBER_KEY,
    mapper: localStorageMappers.integer,
  });
}

function setSearchedDocumentNumber(searchedDocumentNumber: number | undefined) {
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_SEARCHED_DOCUMENT_NUMBER_KEY,
    value: searchedDocumentNumber,
    mapper: localStorageMappers.integer,
  });
}
