import { range } from 'lodash';
import { fileNameHandler } from './fileNameHandler';
import { idModule } from '../../../modules/id';

describe('fileNameHandler', () => {
  describe('sortFileNames', () => {
    it('should sort file names', () => {
      const ids = range(4).map(() => idModule.lib.buildId());
      const fileNames = [3, 1, 2, 0].map((order) =>
        fileNameHandler.buildFileName({ _id: ids[order], order, extension: 'ts' }),
      );

      const sortedAscFileNames = fileNameHandler.sortFileNames(fileNames, 'asc');
      const sortedDescFileNames = fileNameHandler.sortFileNames(fileNames, 'desc');

      expect(sortedAscFileNames).toEqual([fileNames[3], fileNames[1], fileNames[2], fileNames[0]]);
      expect(sortedDescFileNames).toEqual([fileNames[0], fileNames[2], fileNames[1], fileNames[3]]);
    });
  });

  describe('parseFileName', () => {
    it('should extract id and order from file name', () => {
      const fileName = '23_60a28c374703857b2cd08d1b.ts';

      const { _id, order } = fileNameHandler.parseFileName(fileName);

      expect(idModule.lib.convertToString(_id)).toBe('60a28c374703857b2cd08d1b');
      expect(order).toBe(23);
    });
  });

  describe('buildFileName', () => {
    it('should build file name', () => {
      const _id = idModule.lib.buildId('60a28c374703857b2cd08d1b');

      const fileName = fileNameHandler.buildFileName({ order: 11, _id, extension: 'ts' });

      expect(fileName).toEqual('11_60a28c374703857b2cd08d1b.ts');
    });
  });
});
