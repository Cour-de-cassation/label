import { idModule, idType } from '@label/core';

export { localStorageMappers };

export type { localStorageMapperType };

type localStorageMapperType<T> = {
  fromLocalStorage: (item: string | null) => T | undefined;
  toLocalStorage: (value: T) => string;
};

const localStorageMappers = {
  boolean: buildBooleanMapper(),
  date: buildDateMapper(),
  id: buildIdMapper(),
  integer: buildIntegerMapper(),
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

function buildIdMapper(): localStorageMapperType<idType> {
  return {
    fromLocalStorage(item) {
      if (item === null) {
        return undefined;
      }
      return idModule.lib.buildId(item);
    },

    toLocalStorage(value) {
      return idModule.lib.convertToString(value);
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

function buildIntegerMapper(): localStorageMapperType<number> {
  return {
    fromLocalStorage(item) {
      if (item) {
        const parsedItem = parseInt(item);
        if (!isNaN(parsedItem)) {
          return parsedItem;
        }
      }
      return undefined;
    },

    toLocalStorage(value) {
      return value.toString();
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
