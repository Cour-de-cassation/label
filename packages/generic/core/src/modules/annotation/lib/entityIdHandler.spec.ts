import { entityIdHandler } from './entityIdHandler';

describe('entityIdHandler', () => {
  describe('compute', () => {
    it('should compute an annotation entity id', () => {
      const category = 'CATEGORY';
      const text = 'TEXT';

      const entityId = entityIdHandler.compute(category, text);

      expect(entityId).toEqual('CATEGORY_TEXT');
    });
  });
});
