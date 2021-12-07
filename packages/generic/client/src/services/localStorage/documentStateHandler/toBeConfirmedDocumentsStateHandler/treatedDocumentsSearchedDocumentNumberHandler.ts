import { localStorageHandler } from '../../localStorageHandler';
import { localStorageMappers } from '../../localStorageMappers';

export { getSearchedDocumentNumber, setSearchedDocumentNumber };

const TO_BE_CONFIRMED_DOCUMENTS_SEARCHED_DOCUMENT_NUMBER_KEY = 'TO_BE_CONFIRMED_DOCUMENTS_SEARCHED_DOCUMENT_NUMBER';

function getSearchedDocumentNumber() {
  return localStorageHandler.get({
    key: TO_BE_CONFIRMED_DOCUMENTS_SEARCHED_DOCUMENT_NUMBER_KEY,
    mapper: localStorageMappers.integer,
  });
}

function setSearchedDocumentNumber(searchedDocumentNumber: number | undefined) {
  localStorageHandler.set({
    key: TO_BE_CONFIRMED_DOCUMENTS_SEARCHED_DOCUMENT_NUMBER_KEY,
    value: searchedDocumentNumber,
    mapper: localStorageMappers.integer,
  });
}
