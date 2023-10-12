import { annotationModule } from '../../modules/annotation';
import { annotationLinkHandler } from './annotationLinkHandler';

describe('annotationLinker', () => {
  describe('countLinkedEntities', () => {
    it('should return the linked entities count', () => {
      const annotations = [
        { category: 'firstName', text: 'Nicolas' },
        { category: 'firstName', text: 'Nicolas' },
        { category: 'firstName', text: 'nicolas' },
        { category: 'firstName', text: 'Romain' },
        { category: 'firstName', text: 'Romain' },
        { category: 'firstName', text: 'romain' },
        { category: 'firstName', text: 'Romain' },
        { category: 'firstName', text: 'Benoit' },
        { category: 'firstName', text: 'Nicolaz' },
        { category: 'firstName', text: 'Romaun' },
      ].map(annotationModule.generator.generate);
      const linkedAnnotations = annotationLinkHandler.link(
        annotations[0],
        annotations[8],
        annotationLinkHandler.link(annotations[3], annotations[9], annotations),
      );

      const linkedEntitiesCount = annotationLinkHandler.countLinkedEntities(linkedAnnotations);

      expect(linkedEntitiesCount).toEqual(2);
    });
  });

  describe('getLinkableAnnotations', () => {
    it('should return all the linkable annotations to the given annotation', () => {
      const category = 'CATEGORY';
      const annotations = [
        { category: category },
        { category: category, text: 'Z' },
        { category: category, text: 'A' },
        { category: category, text: 'A' },
        { category: 'ANOTHER_CATEGORY' },
      ].map(annotationModule.generator.generate);

      const linkableAnnotations = annotationLinkHandler.getLinkableAnnotations(annotations[0], annotations);

      expect(linkableAnnotations).toEqual([annotations[2], annotations[1]]);
    });
  });

  describe('getLinkedAnnotations', () => {
    it('should return all the linked annotations to the given annotation', () => {
      const category = 'CATEGORY';
      const annotations = [
        { category: category, text: 'TEXT1' },
        { category: category, text: 'TEXT2' },
        { category: category, text: 'TEXT3' },
        { category: category, text: 'TEXT3' },
        { category: 'ANOTHER_CATEGORY' },
      ].map(annotationModule.generator.generate);
      const annotationsWithLinks1 = annotationLinkHandler.link(annotations[0], annotations[2], annotations);
      const annotationsWithLinks2 = annotationLinkHandler.link(
        annotationsWithLinks1[0],
        annotationsWithLinks1[1],
        annotationsWithLinks1,
      );
      const annotationsWithLinks3 = annotationLinkHandler.link(
        annotationsWithLinks2[0],
        annotationsWithLinks2[2],
        annotationsWithLinks2,
      );

      const linkedAnnotations = annotationLinkHandler.getLinkedAnnotations(
        annotationsWithLinks3[0].entityId,
        annotationsWithLinks3,
      );

      expect(linkedAnnotations).toEqual([
        annotationsWithLinks3[0],
        annotationsWithLinks3[1],
        annotationsWithLinks3[2],
        annotationsWithLinks3[3],
      ]);
    });
  });

  describe('getLinkedAnnotationRepresentatives', () => {
    it('should return all the linked annotation representatives to the given annotation', () => {
      const category = 'CATEGORY';
      const annotations = [
        { category: category, text: 'TEXT1' },
        { category: category, text: 'TEXT2' },
        { category: category, text: 'TEXT3' },
        { category: category, text: 'TEXT3' },
        { category: 'ANOTHER_CATEGORY' },
      ].map(annotationModule.generator.generate);
      const annotationsWithLinks1 = annotationLinkHandler.link(annotations[0], annotations[2], annotations);
      const annotationsWithLinks2 = annotationLinkHandler.link(
        annotationsWithLinks1[0],
        annotationsWithLinks1[1],
        annotationsWithLinks1,
      );
      const annotationsWithLinks3 = annotationLinkHandler.link(
        annotationsWithLinks2[0],
        annotationsWithLinks2[2],
        annotationsWithLinks2,
      );

      const linkedAnnotations = annotationLinkHandler.getLinkedAnnotationRepresentatives(
        annotationsWithLinks3[0].entityId,
        annotationsWithLinks3,
      );

      expect(linkedAnnotations).toEqual([annotationsWithLinks3[0], annotationsWithLinks3[1], annotationsWithLinks3[2]]);
    });
  });

  describe('getRepresentatives', () => {
    it('should return all the representatives of the given annotations', () => {
      const category = 'CATEGORY';
      const annotations = [
        { category: category, text: 'B' },
        { category: category, text: 'Z' },
        { category: category, text: 'A' },
        { category: category, text: 'A' },
        { category: 'ANOTHER_CATEGORY', text: 'A' },
      ].map(annotationModule.generator.generate);

      const representatives = annotationLinkHandler.getRepresentatives(annotations);

      expect(representatives).toEqual([annotations[2], annotations[4], annotations[0], annotations[1]]);
    });
  });

  describe('isLinked', () => {
    it('should return true if the annotation is linked to another one', () => {
      const category = 'CATEGORY';
      const annotations = [{ category: category }, { category: category }].map(annotationModule.generator.generate);
      const annotationsWithLinks = annotationLinkHandler.link(annotations[0], annotations[1], annotations);

      const annotationIsLinked = annotationLinkHandler.isLinked(annotationsWithLinks[0], annotationsWithLinks);

      expect(annotationIsLinked).toEqual(true);
    });
  });

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
      ].map(annotationModule.generator.generate);
      const entityIdOfTextTarget = annotations[2].entityId;

      const newAnnotations = annotationLinkHandler.link(annotations[0], annotations[2], annotations);

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
      ].map(annotationModule.generator.generate);
      const entityIdOfText3 = annotations[2].entityId;
      const annotationsWithLinks = annotationLinkHandler.link(annotations[0], annotations[1], annotations);

      const newAnnotations = annotationLinkHandler.link(
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
      ].map(annotationModule.generator.generate);
      const entityIdOfText3 = annotations[2].entityId;
      const annotationsWithLinks = annotationLinkHandler.link(annotations[1], annotations[2], annotations);

      const newAnnotations = annotationLinkHandler.link(
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

  describe('unlink', () => {
    it('should unlink the given annotation (source of a link)', () => {
      const category = 'CATEGORY';
      const textSource = 'SOURCE';
      const textTarget = 'TARGET';
      const annotations = [
        { category: category, text: textSource },
        { category: category, text: textSource },
        { category: category, text: textTarget },
        {},
      ].map(annotationModule.generator.generate);
      const annotationsWithLinks = annotationLinkHandler.link(annotations[0], annotations[2], annotations);

      const newAnnotations = annotationLinkHandler.unlink(annotationsWithLinks[0], annotationsWithLinks);

      expect(newAnnotations).toEqual(annotations);
    });
    it('should unlink the given annotation (target of a link)', () => {
      const category = 'CATEGORY';
      const textSource = 'SOURCE';
      const textTarget = 'TARGET';
      const annotations = [
        { category: category, text: textSource },
        { category: category, text: textSource },
        { category: category, text: textTarget },
        {},
      ].map(annotationModule.generator.generate);
      const annotationsWithLinks = annotationLinkHandler.link(annotations[0], annotations[2], annotations);

      const newAnnotations = annotationLinkHandler.unlink(annotationsWithLinks[2], annotationsWithLinks);

      expect(newAnnotations).toEqual(annotations);
    });
  });

  describe('unlinkByCategoryAndText', () => {
    it('should unlink only the given annotation (source of a link)', () => {
      const category = 'CATEGORY';
      const textSource = 'SOURCE';
      const textTarget1 = 'TARGET1';
      const textTarget2 = 'TARGET2';
      const annotations = [
        { category: category, text: textSource },
        { category: category, text: textSource },
        { category: category, text: textTarget1 },
        { category: category, text: textTarget2 },
      ].map(annotationModule.generator.generate);
      const annotationsWithLinks1 = annotationLinkHandler.link(annotations[0], annotations[3], annotations);
      const annotationsWithLinks2 = annotationLinkHandler.link(
        annotationsWithLinks1[0],
        annotationsWithLinks1[2],
        annotationsWithLinks1,
      );

      const newAnnotations = annotationLinkHandler.unlinkByCategoryAndText(
        annotationsWithLinks2[0],
        annotationsWithLinks2,
      );

      expect(newAnnotations[0]).toEqual(annotations[0]);
      expect(newAnnotations[1]).toEqual(annotations[1]);
      expect(annotationLinkHandler.isLinkedTo(newAnnotations[2], newAnnotations[3])).toEqual(true);
    });
    it('should unlink the given annotation (target of a link)', () => {
      const category = 'CATEGORY';
      const textSource = 'SOURCE';
      const textTarget1 = 'TARGET1';
      const textTarget2 = 'TARGET2';
      const annotations = [
        { category: category, text: textSource },
        { category: category, text: textSource },
        { category: category, text: textTarget1 },
        { category: category, text: textTarget2 },
      ].map(annotationModule.generator.generate);
      const annotationsWithLinks1 = annotationLinkHandler.link(annotations[0], annotations[3], annotations);
      const annotationsWithLinks2 = annotationLinkHandler.link(
        annotationsWithLinks1[0],
        annotationsWithLinks1[2],
        annotationsWithLinks1,
      );

      const newAnnotations = annotationLinkHandler.unlinkByCategoryAndText(
        annotationsWithLinks2[3],
        annotationsWithLinks2,
      );

      expect(newAnnotations[3]).toEqual(annotations[3]);
      expect(annotationLinkHandler.isLinkedTo(newAnnotations[0], newAnnotations[2])).toEqual(true);
    });
  });
});
