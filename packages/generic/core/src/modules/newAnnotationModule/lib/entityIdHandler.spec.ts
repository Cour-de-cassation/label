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
  describe('getCategory', () => {
    it('should return the category associated to an entity id', () => {
      const category = 'CATEGORY';
      const text = 'TEXT';
      const entityId = entityIdHandler.compute(category, text);

      const entityIdCategory = entityIdHandler.getCategory(entityId);

      expect(entityIdCategory).toEqual(category);
    });
  });
  describe('getText', () => {
    it('should return the text associated to an entity id', () => {
      const category = 'CATEGORY';
      const text = 'TEXT';
      const entityId = entityIdHandler.compute(category, text);

      const entityIdText = entityIdHandler.getText(entityId);

      expect(entityIdText).toEqual(text);
    });
  });
});
