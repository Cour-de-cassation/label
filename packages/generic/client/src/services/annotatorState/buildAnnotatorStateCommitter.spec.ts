import { range } from 'lodash';
import { annotationModule, documentModule } from '@label/core';
import { fetchedAnnotationType } from '../../types';
import { annotatorStateType } from './annotatorStateType';
import { buildAnnotatorStateCommitter } from './buildAnnotatorStateCommitter';

describe('buildAnnotatorStateCommitter', () => {
  const annotations = range(7).map(() => annotationModule.generator.generate());

  describe('revert', () => {
    it('should revert an action', () => {
      const annotatorStateCommitter = buildAnnotatorStateCommitter();
      const state1 = buildAnnotatorState([annotations[0], annotations[1], annotations[2]]);
      const state2 = buildAnnotatorState([annotations[2], annotations[3], annotations[4]]);
      annotatorStateCommitter.commit(state1, state2);

      const state3 = annotatorStateCommitter.revert(state2);

      expect(sortAnnotations(state3.annotations)).toEqual(sortAnnotations(state1.annotations));
    });
    it('should work when used several times', () => {
      const annotatorStateCommitter = buildAnnotatorStateCommitter();
      const state1 = buildAnnotatorState([annotations[0], annotations[1], annotations[2]]);
      const state2 = buildAnnotatorState([annotations[0], annotations[2], annotations[4]]);
      const state3 = buildAnnotatorState([annotations[4], annotations[5], annotations[6]]);
      annotatorStateCommitter.commit(state1, state2);
      annotatorStateCommitter.commit(state2, state3);

      const state4 = annotatorStateCommitter.revert(annotatorStateCommitter.revert(state3));

      expect(sortAnnotations(state4.annotations)).toEqual(sortAnnotations(state1.annotations));
    });
  });

  describe('restore', () => {
    it('should restore an action after revertion', () => {
      const annotatorStateCommitter = buildAnnotatorStateCommitter();
      const state1 = buildAnnotatorState([annotations[0], annotations[1], annotations[2]]);
      const state2 = buildAnnotatorState([annotations[2], annotations[3], annotations[4]]);
      annotatorStateCommitter.commit(state1, state2);
      const state3 = annotatorStateCommitter.revert(state2);

      const state4 = annotatorStateCommitter.restore(state3);

      expect(sortAnnotations(state4.annotations)).toEqual(sortAnnotations(state2.annotations));
    });
    it('should work when used several times', () => {
      const annotatorStateCommitter = buildAnnotatorStateCommitter();
      const state1 = buildAnnotatorState([annotations[0], annotations[1], annotations[2]]);
      const state2 = buildAnnotatorState([annotations[0], annotations[2], annotations[4]]);
      const state3 = buildAnnotatorState([annotations[4], annotations[5], annotations[6]]);
      annotatorStateCommitter.commit(state1, state2);
      annotatorStateCommitter.commit(state2, state3);
      const state4 = annotatorStateCommitter.revert(annotatorStateCommitter.revert(state3));

      const state5 = annotatorStateCommitter.restore(annotatorStateCommitter.restore(state4));

      expect(sortAnnotations(state5.annotations)).toEqual(sortAnnotations(state3.annotations));
    });
  });
});

function sortAnnotations(annotations: fetchedAnnotationType[]) {
  return annotations.sort((annotation1, annotation2) =>
    JSON.stringify(annotation1._id).localeCompare(JSON.stringify(annotation2._id)),
  );
}

function buildAnnotatorState(annotations: fetchedAnnotationType[]): annotatorStateType {
  return {
    annotations,
    document: documentModule.generator.generate(),
    settings: {},
  };
}
