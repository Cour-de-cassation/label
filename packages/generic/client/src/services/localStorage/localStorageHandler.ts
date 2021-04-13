import { localStorageMapperType } from './localStorageMappers';

export { localStorageHandler };

const localStorageHandler = {
  get<T>({ key, mapper }: { key: string; mapper: localStorageMapperType<T> }): T | undefined {
    const item = localStorage.getItem(key);
    return mapper.fromLocalStorage(item);
  },

  set<T>({ key, value, mapper }: { key: string; value: T | undefined; mapper: localStorageMapperType<T> }) {
    if (value === undefined) {
      return localStorage.removeItem(key);
    }

    const item = mapper.toLocalStorage(value);
    return localStorage.setItem(key, item);
  },
};
