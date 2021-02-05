import React, { createContext, ReactElement, ReactNode, useState } from 'react';
import { annotationsDiffModule, documentModule } from '@label/core';
import { annotationsCommitterType } from './buildAnnotationsCommitter';
import { annotatorStateType } from './annotatorStateType';
import { annotatorStateHandlerType, buildAnnotatorStateHandler } from './buildAnnotatorStateHandler';
import { autoSaverType } from './buildAutoSaver';

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
  autoSaver: autoSaverType;
  children: ReactNode;
  committer: annotationsCommitterType;
  initialAnnotatorState: annotatorStateType;
}): ReactElement {
  const [annotatorState, setAnnotatorState] = useState(props.initialAnnotatorState);
  const { annotatorStateHandler } = buildAnnotatorStateHandler({
    annotatorState,
    autoSaver: props.autoSaver,
    committer: props.committer,
    setAnnotatorState,
    resetAnnotatorState: () => setAnnotatorState(props.initialAnnotatorState),
  });
  return (
    <AnnotatorStateHandlerContext.Provider value={annotatorStateHandler}>
      {props.children}
    </AnnotatorStateHandlerContext.Provider>
  );
}
