import { annotationModule } from '../../modules/annotation';
import { annotationLinkHandler } from '../annotationLinkHandler';
import { autoLinker } from './autoLinker';

describe('autoLinker', () => {
  describe('autoLink', () => {
    it('should link the given annotations', () => {
      const annotations = [
        { category: 'CATEGORY', text: 'Dupont' },
        { category: 'CATEGORY', text: 'Dupond' },
      ].map(annotationModule.generator.generate);

      const linkedAnnotations = autoLinker.autoLink([annotations[0]], annotations);

      expect(linkedAnnotations).toEqual(annotationLinkHandler.link(annotations[0], annotations[1], annotations));
    });
  });

  describe('autoLinkAll', () => {
    it('should not link annotations of different category', () => {
      const annotations = [
        { category: 'CATEGORY', text: 'annotation' },
        { category: 'ANOTHER_CATEGORY', text: 'ANNOTATION' },
      ].map(annotationModule.generator.generate);

      const linkedAnnotations = autoLinker.autoLinkAll(annotations);

      expect(linkedAnnotations).toEqual(annotations);
    });

    describe('case sensitivity', () => {
      it('should link the annotations of a same category with only different case', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'annotation' },
          { category: 'CATEGORY', text: 'ANNOTATION' },
          { category: 'ANOTHER_CATEGORY', text: 'another_annotation' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations);

        expect(linkedAnnotations).toEqual(annotationLinkHandler.link(annotations[0], annotations[1], annotations));
      });
    });

    describe('subword', () => {
      it('should link the annotations of a same category which are subword of another', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'longer annotation' },
          { category: 'CATEGORY', text: 'annotation' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations);

        expect(linkedAnnotations).toEqual(annotationLinkHandler.link(annotations[0], annotations[1], annotations));
      });
      it('should link the annotations of a same category which are subword of another (case insensitive)', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'longer aNnOTaTiOn' },
          { category: 'CATEGORY', text: 'annotation' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations);

        expect(linkedAnnotations).toEqual(annotationLinkHandler.link(annotations[0], annotations[1], annotations));
      });
      it('should not link the annotations of a same category which are only substring of another', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'longer_annotation' },
          { category: 'CATEGORY', text: 'annotation' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations);

        expect(linkedAnnotations).toEqual(annotations);
      });
    });

    describe('similar word', () => {
      it('should link the annotations of a same category with a Levenshtein distance inferior to 1 for words less long than 4', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'Pont' },
          { category: 'CATEGORY', text: 'Pond' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations);

        expect(linkedAnnotations).toEqual(annotationLinkHandler.link(annotations[0], annotations[1], annotations));
      });
      it('should link the annotations of a same category with a Levenshtein distance inferior to 1 for words less long than 4 (case insensitive)', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'Pont' },
          { category: 'CATEGORY', text: 'POND' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations);

        expect(linkedAnnotations).toEqual(annotationLinkHandler.link(annotations[0], annotations[1], annotations));
      });
      it('should not link the annotations of a same category with a Levenshtein distance strictly superior to 1 for words less long than 4', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'Pont' },
          { category: 'CATEGORY', text: 'Pomd' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations);

        expect(linkedAnnotations).toEqual(annotations);
      });
      it('should link the annotations of a same category with a Levenshtein distance inferior to 2 for words longer than 4', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'Dupont' },
          { category: 'CATEGORY', text: 'Dupond' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations);

        expect(linkedAnnotations).toEqual(annotationLinkHandler.link(annotations[0], annotations[1], annotations));
      });
      it('should link the annotations of a same category with a Levenshtein distance inferior to 2 for words longer than 4 (case insensitive)', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'Dupont' },
          { category: 'CATEGORY', text: 'DUPOND' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations);

        expect(linkedAnnotations).toEqual(annotationLinkHandler.link(annotations[0], annotations[1], annotations));
      });
      it('should not link the annotations of a same category with a Levenshtein distance strictly superior to 2 for words longer than 4', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'Dupont' },
          { category: 'CATEGORY', text: 'Dubomb' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations);

        expect(linkedAnnotations).toEqual(annotations);
      });
    });
  });
});
