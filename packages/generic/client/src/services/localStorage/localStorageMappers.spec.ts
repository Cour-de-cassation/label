import { localStorageMappers } from './localStorageMappers';

describe('localStorageMappers', () => {
  describe('boolean', () => {
    describe('fromLocalStorage', () => {
      it('should return true if "true" passed', () => {
        const item = 'true';

        expect(localStorageMappers.boolean.fromLocalStorage(item)).toBe(true);
      });

      it('should return false if "false" passed', () => {
        const item = 'false';

        expect(localStorageMappers.boolean.fromLocalStorage(item)).toBe(false);
      });

      it('should return undefined if null passed', () => {
        const item = null;

        expect(localStorageMappers.boolean.fromLocalStorage(item)).toBe(undefined);
      });
    });

    describe('toLocalStorage', () => {
      it('should return "true" if true passed', () => {
        const value = true;

        expect(localStorageMappers.boolean.toLocalStorage(value)).toBe('true');
      });

      it('should return "false" if false passed', () => {
        const value = false;

        expect(localStorageMappers.boolean.toLocalStorage(value)).toBe('false');
      });
    });
  });

  describe('date', () => {
    describe('itemToDate', () => {
      it('should return date if "2021-04-13T09:00:29.661Z" passed', () => {
        const item = '2021-04-13T09:00:29.661Z';

        expect(localStorageMappers.date.fromLocalStorage(item)).toEqual(new Date('2021-04-13T09:00:29.661Z'));
      });
    });

    describe('dateToItem', () => {
      it('should return "2021-04-13T09:00:29.661Z" if date passed', () => {
        const value = new Date('2021-04-13T09:00:29.661Z');

        expect(localStorageMappers.date.toLocalStorage(value)).toEqual('2021-04-13T09:00:29.661Z');
      });
    });
  });
});
