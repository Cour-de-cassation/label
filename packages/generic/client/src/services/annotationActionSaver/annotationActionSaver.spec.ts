import { range } from 'lodash';
import { annotationModule, annotationType } from '@label/core';
import { buildAnnotationActionSaver } from './buildAnnotationActionSaver';

describe('annotationActionSaver', () => {
  const annotations = range(7).map(() => annotationModule.generator.generate());

  describe('revertAction', () => {
    it('should revert an action', () => {
      const annotationActionSaver = buildAnnotationActionSaver();
      const state1 = [annotations[0], annotations[1], annotations[2]];
      const state2 = [annotations[2], annotations[3], annotations[4]];
      annotationActionSaver.appendAction(state1, state2);

      const state3 = annotationActionSaver.revertAction(state2);

      expect(sortState(state3)).toEqual(sortState(state1));
    });
    it('should work when used several times', () => {
      const annotationActionSaver = buildAnnotationActionSaver();
      const state1 = [annotations[0], annotations[1], annotations[2]];
      const state2 = [annotations[0], annotations[2], annotations[4]];
      const state3 = [annotations[4], annotations[5], annotations[6]];
      annotationActionSaver.appendAction(state1, state2);
      annotationActionSaver.appendAction(state2, state3);

      const state4 = annotationActionSaver.revertAction(annotationActionSaver.revertAction(state3));

      expect(sortState(state4)).toEqual(sortState(state1));
    });
  });

  describe('restoreAction', () => {
    it('should restore an action after revertion', () => {
      const annotationActionSaver = buildAnnotationActionSaver();
      const state1 = [annotations[0], annotations[1], annotations[2]];
      const state2 = [annotations[2], annotations[3], annotations[4]];
      annotationActionSaver.appendAction(state1, state2);
      const state3 = annotationActionSaver.revertAction(state2);

      const state4 = annotationActionSaver.restoreAction(state3);

      expect(sortState(state4)).toEqual(sortState(state2));
    });
    it('should work when used several times', () => {
      const annotationActionSaver = buildAnnotationActionSaver();
      const state1 = [annotations[0], annotations[1], annotations[2]];
      const state2 = [annotations[0], annotations[2], annotations[4]];
      const state3 = [annotations[4], annotations[5], annotations[6]];
      annotationActionSaver.appendAction(state1, state2);
      annotationActionSaver.appendAction(state2, state3);
      const state4 = annotationActionSaver.revertAction(annotationActionSaver.revertAction(state3));

      const state5 = annotationActionSaver.restoreAction(annotationActionSaver.restoreAction(state4));

      expect(sortState(state5)).toEqual(sortState(state3));
    });
  });
});

function sortState(state: annotationType[]) {
  return state.sort((annotation1, annotation2) =>
    JSON.stringify(annotation1._id).localeCompare(JSON.stringify(annotation2._id)),
  );
}
