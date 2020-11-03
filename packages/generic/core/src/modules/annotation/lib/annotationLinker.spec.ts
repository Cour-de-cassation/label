import { annotationGenerator } from '../generator';
import { annotationLinker } from './annotationLinker';

describe('annotationLinker', () => {
  describe('link', () => {
    it('should link the annotations of the category/text source to the annotations of the category/text target', () => {
      const category = 'CATEGORY';
      const textSource = 'SOURCE';
      const textTarget = 'TARGET';
      const annotations = [
        { category: category, text: textSource },
        { category: category, text: textSource },
        { category: category, text: textTarget },
        {},
      ].map(annotationGenerator.generate);
      const entityIdOfTextTarget = annotations[2].entityId;

      const newAnnotations = annotationLinker.link(annotations[0], annotations[2], annotations);

      expect(newAnnotations).toEqual([
        { ...annotations[0], entityId: entityIdOfTextTarget },
        { ...annotations[1], entityId: entityIdOfTextTarget },
        { ...annotations[2], entityId: entityIdOfTextTarget },
        annotations[3],
      ]);
    });
    it('should work with forward links', () => {
      const category = 'CATEGORY';
      const text1 = '1';
      const text2 = '2';
      const text3 = '3';
      const annotations = [
        { category: category, text: text1 },
        { category: category, text: text2 },
        { category: category, text: text3 },
      ].map(annotationGenerator.generate);
      const entityIdOfText3 = annotations[2].entityId;
      const annotationsWithLinks = annotationLinker.link(annotations[0], annotations[1], annotations);

      const newAnnotations = annotationLinker.link(
        annotationsWithLinks[1],
        annotationsWithLinks[2],
        annotationsWithLinks,
      );

      expect(newAnnotations).toEqual([
        { ...annotations[0], entityId: entityIdOfText3 },
        { ...annotations[1], entityId: entityIdOfText3 },
        { ...annotations[2], entityId: entityIdOfText3 },
      ]);
    });
    it('should work with backward links ', () => {
      const category = 'CATEGORY';
      const text1 = '1';
      const text2 = '2';
      const text3 = '3';
      const annotations = [
        { category: category, text: text1 },
        { category: category, text: text2 },
        { category: category, text: text3 },
      ].map(annotationGenerator.generate);
      const entityIdOfText3 = annotations[2].entityId;
      const annotationsWithLinks = annotationLinker.link(annotations[1], annotations[2], annotations);

      const newAnnotations = annotationLinker.link(
        annotationsWithLinks[0],
        annotationsWithLinks[1],
        annotationsWithLinks,
      );

      expect(newAnnotations).toEqual([
        { ...annotations[0], entityId: entityIdOfText3 },
        { ...annotations[1], entityId: entityIdOfText3 },
        { ...annotations[2], entityId: entityIdOfText3 },
      ]);
    });
  });

  describe('isLinked', () => {
    it('should return true if the annotation is linked to another one', () => {
      const category = 'CATEGORY';
      const annotations = [{ category: category }, { category: category }].map(annotationGenerator.generate);
      const annotationsWithLinks = annotationLinker.link(annotations[0], annotations[1], annotations);

      const annotationIsLinked = annotationLinker.isLinked(annotationsWithLinks[0], annotationsWithLinks);

      expect(annotationIsLinked).toEqual(true);
    });
  });

  describe('getLinkableAnnotations', () => {
    it('should return all the linkable annotations to the given annotation', () => {
      const category = 'CATEGORY';
      const annotations = [
        { category: category },
        { category: category },
        { category: category },
        { category: 'ANOTHER_CATEGORY' },
      ].map(annotationGenerator.generate);

      const linkableAnnotations = annotationLinker.getLinkableAnnotations(annotations[0], annotations);

      expect(linkableAnnotations.sort()).toEqual([annotations[1], annotations[2]].sort());
    });
  });

  describe('unlink', () => {
    it('should unlink the given annotation', () => {
      const category = 'CATEGORY';
      const textSource = 'SOURCE';
      const textTarget = 'TARGET';
      const annotations = [
        { category: category, text: textSource },
        { category: category, text: textSource },
        { category: category, text: textTarget },
        {},
      ].map(annotationGenerator.generate);
      const annotationsWithLinks = annotationLinker.link(annotations[0], annotations[2], annotations);

      const newAnnotations = annotationLinker.unlink(annotationsWithLinks[0], annotationsWithLinks);

      expect(newAnnotations).toEqual(annotations);
    });
  });
});
