import { localStorageHandler } from './localStorageHandler';
import { localStorageMappers } from './localStorageMappers';

const ADMIN_VIEW_STORAGE_KEY = 'ADMIN_VIEW';

export { adminViewHandler, adminViews };

const adminViews = ['admin', 'annotator', 'specialDocumentAnnotator'] as const;

const adminViewHandler = {
  set,
  remove,
  get,
};

function set(adminView: typeof adminViews[number]) {
  localStorageHandler.set({ key: ADMIN_VIEW_STORAGE_KEY, value: adminView, mapper: localStorageMappers.string });
}

function remove() {
  localStorageHandler.set({ key: ADMIN_VIEW_STORAGE_KEY, value: undefined, mapper: localStorageMappers.string });
}

function get() {
  return localStorageHandler.get({ key: ADMIN_VIEW_STORAGE_KEY, mapper: localStorageMappers.string }) as
    | typeof adminViews[number]
    | undefined;
}
