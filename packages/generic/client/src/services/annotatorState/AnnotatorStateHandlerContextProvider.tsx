import React, { createContext, ReactElement, ReactNode, useState } from 'react';
import { annotationsDiffModule, annotationsDiffType, documentModule } from '@label/core';
import { annotationsCommitterType } from './buildAnnotationsCommitter';
import { annotatorStateType } from './annotatorStateType';
import { annotatorStateHandlerType, buildAnnotatorStateHandler } from './buildAnnotatorStateHandler';

export { AnnotatorStateHandlerContext, AnnotatorStateHandlerContextProvider };

const AnnotatorStateHandlerContext = createContext<annotatorStateHandlerType>({
  canRestore: () => false,
  canRevert: () => false,
  get: () => ({
    annotations: [],
    settings: {},
    document: documentModule.generator.generate(),
  }),
  reinitialize: () => null,
  restore: () => null,
  revert: () => null,
  set: () => null,
  getGlobalAnnotationsDiff: () => annotationsDiffModule.lib.buildAnnotationsDiff([], []),
});

function AnnotatorStateHandlerContextProvider(props: {
  children: ReactNode;
  initialAnnotatorState: annotatorStateType;
  committer: annotationsCommitterType;
  onAnnotatorStateChange?: (annotatorState: annotatorStateType, annotationsDiff: annotationsDiffType) => void;
}): ReactElement {
  const [annotatorState, setAnnotatorState] = useState(props.initialAnnotatorState);
  const { annotatorStateHandler } = buildAnnotatorStateHandler(
    annotatorState,
    (annotatorState: annotatorStateType) => {
      setAnnotatorState(annotatorState);
      if (props.onAnnotatorStateChange) {
        const annotationsDiff = props.committer.squash();
        props.onAnnotatorStateChange(annotatorState, annotationsDiff);
      }
    },
    () => setAnnotatorState(props.initialAnnotatorState),
    props.committer,
  );
  return (
    <AnnotatorStateHandlerContext.Provider value={annotatorStateHandler}>
      {props.children}
    </AnnotatorStateHandlerContext.Provider>
  );
}
