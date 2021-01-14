import React, { createContext, ReactElement, ReactNode, useState } from 'react';
import { documentModule } from '@label/core';
import { annotatorStateCommitterType } from './buildAnnotatorStateCommitter';
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
});

function AnnotatorStateHandlerContextProvider(props: {
  children: ReactNode;
  initialAnnotatorState: annotatorStateType;
  committer: annotatorStateCommitterType;
}): ReactElement {
  const [annotatorState, setAnnotatorState] = useState(props.initialAnnotatorState);
  const { annotatorStateHandler } = buildAnnotatorStateHandler(
    annotatorState,
    setAnnotatorState,
    () => setAnnotatorState(props.initialAnnotatorState),
    props.committer,
  );
  return (
    <AnnotatorStateHandlerContext.Provider value={annotatorStateHandler}>
      {props.children}
    </AnnotatorStateHandlerContext.Provider>
  );
}
