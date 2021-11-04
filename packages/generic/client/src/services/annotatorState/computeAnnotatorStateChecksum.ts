import { annotationModule } from '@label/core';
import { annotatorStateType } from './annotatorStateType';

export { computeAnnotatorStateChecksum };

function computeAnnotatorStateChecksum(annotatorState: annotatorStateType) {
  const annotations = annotatorState.annotations;
  return JSON.stringify(annotationModule.lib.sortAnnotations(annotations));
}
