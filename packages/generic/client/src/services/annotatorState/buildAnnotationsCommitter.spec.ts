import { range } from 'lodash';
import { annotationModule } from '@label/core';
import { buildAnnotationsCommitter } from './buildAnnotationsCommitter';

describe('buildAnnotationsCommitter', () => {
  const annotations = range(7).map(() => annotationModule.generator.generate());

  describe('commit', () => {
    it('should be nothing to redo after a commit', () => {
      const annotationsCommitter = buildAnnotationsCommitter();
      const annotations1 = [annotations[0], annotations[1], annotations[2]];
      const annotations2 = [annotations[2], annotations[3], annotations[4]];
      const annotations3 = [annotations[2], annotations[3], annotations[5]];
      annotationsCommitter.commit(annotations1, annotations2);
      const annotations4 = annotationsCommitter.revert(annotations2);

      annotationsCommitter.commit(annotations4, annotations3);

      expect(annotationsCommitter.canRestore()).toEqual(false);
    });
  });

  describe('revert', () => {
    it('should revert an action', () => {
      const annotationsCommitter = buildAnnotationsCommitter();
      const annotations1 = [annotations[0], annotations[1], annotations[2]];
      const annotations2 = [annotations[2], annotations[3], annotations[4]];
      annotationsCommitter.commit(annotations1, annotations2);

      const annotations3 = annotationsCommitter.revert(annotations2);

      expect(annotationModule.lib.sortAnnotations(annotations3)).toEqual(
        annotationModule.lib.sortAnnotations(annotations3),
      );
    });
    it('should work when used several times', () => {
      const annotationsCommitter = buildAnnotationsCommitter();
      const annotations1 = [annotations[0], annotations[1], annotations[2]];
      const annotations2 = [annotations[0], annotations[2], annotations[4]];
      const annotations3 = [annotations[4], annotations[5], annotations[6]];
      annotationsCommitter.commit(annotations1, annotations2);
      annotationsCommitter.commit(annotations2, annotations3);

      const annotations4 = annotationsCommitter.revert(annotationsCommitter.revert(annotations3));

      expect(annotationModule.lib.sortAnnotations(annotations4)).toEqual(
        annotationModule.lib.sortAnnotations(annotations1),
      );
    });
  });

  describe('restore', () => {
    it('should restore an action after revertion', () => {
      const annotationsCommitter = buildAnnotationsCommitter();
      const annotations1 = [annotations[0], annotations[1], annotations[2]];
      const annotations2 = [annotations[2], annotations[3], annotations[4]];
      annotationsCommitter.commit(annotations1, annotations2);
      const annotations3 = annotationsCommitter.revert(annotations2);

      const annotations4 = annotationsCommitter.restore(annotations3);

      expect(annotationModule.lib.sortAnnotations(annotations4)).toEqual(
        annotationModule.lib.sortAnnotations(annotations2),
      );
    });
    it('should work when used several times', () => {
      const annotationsCommitter = buildAnnotationsCommitter();
      const annotations1 = [annotations[0], annotations[1], annotations[2]];
      const annotations2 = [annotations[0], annotations[2], annotations[4]];
      const annotations3 = [annotations[4], annotations[5], annotations[6]];
      annotationsCommitter.commit(annotations1, annotations2);
      annotationsCommitter.commit(annotations2, annotations3);
      const annotations4 = annotationsCommitter.revert(annotationsCommitter.revert(annotations3));

      const annotations5 = annotationsCommitter.restore(annotationsCommitter.restore(annotations4));

      expect(annotationModule.lib.sortAnnotations(annotations5)).toEqual(
        annotationModule.lib.sortAnnotations(annotations3),
      );
    });
  });
});
