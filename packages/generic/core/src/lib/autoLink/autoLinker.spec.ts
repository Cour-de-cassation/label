import { settingsModule } from '../../modules/settings';
import { annotationModule } from '../../modules/annotation';
import { annotationLinkHandler } from '../annotationLinkHandler';
import { autoLinker } from './autoLinker';

describe('autoLinker', () => {
  const settings = settingsModule.lib.buildSettings({
    CATEGORY: {
      autoLinkSensitivity: [
        {
          kind: 'levenshteinDistance',
          threshold: 2,
        },
        { kind: 'caseInsensitive' },
        { kind: 'inclusion' },
      ],
    },
    ANOTHER_CATEGORY: {},
  });
  describe('autoLink', () => {
    it('should link the given annotations', () => {
      const annotations = [
        { category: 'CATEGORY', text: 'Dupont' },
        { category: 'CATEGORY', text: 'Dupond' },
      ].map(annotationModule.generator.generate);

      const linkedAnnotations = autoLinker.autoLink([annotations[0]], annotations, settings);

      expect(linkedAnnotations).toEqual(annotationLinkHandler.link(annotations[0], annotations[1], annotations));
    });

    it('should not link the given annotations', () => {
      const settings = settingsModule.lib.buildSettings({
        CATEGORY: { autoLinkSensitivity: [{ kind: 'caseInsensitive' }] },
      });
      const annotations = [
        { category: 'CATEGORY', text: '12 rue de la grande Rue' },
        { category: 'CATEGORY', text: '11 rue de la grande Rue' },
      ].map(annotationModule.generator.generate);

      const linkedAnnotations = autoLinker.autoLink([annotations[0]], annotations, settings);

      expect(linkedAnnotations.sort()).toEqual([...annotations].sort());
    });
  });

  describe('autoLinkAll', () => {
    it('should not link annotations of different category', () => {
      const annotations = [
        { category: 'CATEGORY', text: 'annotation' },
        { category: 'ANOTHER_CATEGORY', text: 'ANNOTATION' },
      ].map(annotationModule.generator.generate);

      const linkedAnnotations = autoLinker.autoLinkAll(annotations, settings);

      expect(linkedAnnotations).toEqual(annotations);
    });

    describe('case sensitivity', () => {
      it('should link the annotations of a same category with only different case', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'annotation' },
          { category: 'CATEGORY', text: 'ANNOTATION' },
          { category: 'ANOTHER_CATEGORY', text: 'another_annotation' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations, settings);

        expect(linkedAnnotations).toEqual(annotationLinkHandler.link(annotations[0], annotations[1], annotations));
      });
    });

    describe('do not link category if subword not included', () => {
      const settings = settingsModule.lib.buildSettings({
        CATEGORY: { autoLinkSensitivity: [{ kind: 'caseInsensitive' }, { kind: 'levenshteinDistance', threshold: 2 }] },
      });
      it('should not link the unrelated annotations', () => {
        const annotations = ['Jean', 'Jean Henri', 'Jean Marie'].map((text, index) =>
          annotationModule.lib.buildAnnotation({
            text,
            start: index * 10,
            category: 'CATEGORY',
            score: 1,
            source: 'agent',
          }),
        );

        const linkedAnnotations = autoLinker.autoLinkAll(annotations, settings);

        expect(linkedAnnotations[0].entityId).not.toBe(linkedAnnotations[1].entityId);
        expect(linkedAnnotations[0].entityId).not.toBe(linkedAnnotations[2].entityId);
        expect(linkedAnnotations[1].entityId).not.toBe(linkedAnnotations[2].entityId);
      });
    });

    describe('subword', () => {
      it('should link the annotations of a same category which are subword of another', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'longer annotation' },
          { category: 'CATEGORY', text: 'annotation' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations, settings);

        expect(linkedAnnotations).toEqual(annotationLinkHandler.link(annotations[0], annotations[1], annotations));
      });
      it('should link the annotations of a same category which are subword of another (case insensitive)', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'longer aNnOTaTiOn' },
          { category: 'CATEGORY', text: 'annotation' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations, settings);

        expect(linkedAnnotations).toEqual(annotationLinkHandler.link(annotations[0], annotations[1], annotations));
      });
      it('should not link the annotations of a same category which are only substring of another', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'longer_annotation' },
          { category: 'CATEGORY', text: 'annotation' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations, settings);

        expect(linkedAnnotations).toEqual(annotations);
      });
    });

    describe('similar word', () => {
      it('should link the annotations of a same category with a Levenshtein distance inferior to 1 for words less long than 4', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'Pont' },
          { category: 'CATEGORY', text: 'Pond' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations, settings);

        expect(linkedAnnotations).toEqual(annotationLinkHandler.link(annotations[0], annotations[1], annotations));
      });
      it('should link the annotations of a same category with a Levenshtein distance inferior to 1 for words less long than 4 (case insensitive)', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'Pont' },
          { category: 'CATEGORY', text: 'POND' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations, settings);

        expect(linkedAnnotations).toEqual(annotationLinkHandler.link(annotations[0], annotations[1], annotations));
      });
      it('should not link the annotations of a same category with a Levenshtein distance strictly superior to 1 for words less long than 4', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'Pont' },
          { category: 'CATEGORY', text: 'Pomd' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations, settings);

        expect(linkedAnnotations).toEqual(annotations);
      });
      it('should link the annotations of a same category with a Levenshtein distance inferior to 2 for words longer than 4', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'Dupont' },
          { category: 'CATEGORY', text: 'Dupond' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations, settings);

        expect(linkedAnnotations).toEqual(annotationLinkHandler.link(annotations[0], annotations[1], annotations));
      });
      it('should link the annotations of a same category with a Levenshtein distance inferior to 2 for words longer than 4 (case insensitive)', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'Dupont' },
          { category: 'CATEGORY', text: 'DUPOND' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations, settings);

        expect(linkedAnnotations).toEqual(annotationLinkHandler.link(annotations[0], annotations[1], annotations));
      });
      it('should not link the annotations of a same category with a Levenshtein distance strictly superior to 2 for words longer than 4', () => {
        const annotations = [
          { category: 'CATEGORY', text: 'Dupont' },
          { category: 'CATEGORY', text: 'Dubomb' },
        ].map(annotationModule.generator.generate);

        const linkedAnnotations = autoLinker.autoLinkAll(annotations, settings);

        expect(linkedAnnotations).toEqual(annotations);
      });
    });
  });
});
