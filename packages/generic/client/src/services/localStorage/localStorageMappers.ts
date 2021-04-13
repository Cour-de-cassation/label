export { localStorageMappers };

export type { localStorageMapperType };

type localStorageMapperType<T> = {
  fromLocalStorage: (item: string | null) => T | undefined;
  toLocalStorage: (value: T) => string;
};

const localStorageMappers = {
  boolean: buildBooleanMapper(),
  date: buildDateMapper(),
  string: buildStringMapper(),
};

function buildBooleanMapper(): localStorageMapperType<boolean> {
  return {
    fromLocalStorage(item) {
      switch (item) {
        case 'true':
          return true;
        case 'false':
          return false;
        default:
          return undefined;
      }
    },

    toLocalStorage(value) {
      return value ? 'true' : 'false';
    },
  };
}

function buildDateMapper(): localStorageMapperType<Date> {
  return {
    fromLocalStorage(item) {
      return item ? new Date(item) : undefined;
    },

    toLocalStorage(value) {
      return value.toISOString();
    },
  };
}

function buildStringMapper(): localStorageMapperType<string> {
  return {
    fromLocalStorage(item) {
      return item ? item : undefined;
    },

    toLocalStorage(value) {
      return value;
    },
  };
}
