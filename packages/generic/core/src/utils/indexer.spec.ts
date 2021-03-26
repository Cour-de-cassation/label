import { indexer } from './indexer';

describe('indexer', () => {
  describe('indexBy', () => {
    it('should index by the given function', () => {
      const datas = [
        { a: 'STRING1', b: 1 },
        { a: 'STRING2', b: 2 },
        { a: 'STRING3', b: 3 },
      ];

      const indexedDatas = indexer.indexBy(datas, (data) => data.a);

      expect(indexedDatas).toEqual({
        STRING1: datas[0],
        STRING2: datas[1],
        STRING3: datas[2],
      });
    });
  });

  describe('mapIndexBy', () => {
    it('should index by the given function', () => {
      const datas = [
        { a: 'STRING1', b: 1 },
        { a: 'STRING2', b: 2 },
        { a: 'STRING3', b: 3 },
      ];

      const indexedDatas = indexer.mapIndexBy(
        datas,
        (data) => data.a,
        (data) => data.b * data.b,
      );

      expect(indexedDatas).toEqual({
        STRING1: 1,
        STRING2: 4,
        STRING3: 9,
      });
    });
  });

  describe('indexManyBy', () => {
    it('should index by the given function', () => {
      const datas = [
        { a: 'STRING1', b: 1 },
        { a: 'STRING2', b: 2 },
        { a: 'STRING1', b: 3 },
        { a: 'STRING2', b: 4 },
        { a: 'STRING1', b: 5 },
      ];

      const indexedDatas = indexer.indexManyBy(datas, (data) => data.a);

      expect(indexedDatas).toEqual({
        STRING1: [datas[0], datas[2], datas[4]],
        STRING2: [datas[1], datas[3]],
      });
    });
  });
});
