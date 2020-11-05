import React, { ReactElement } from 'react';
import { fetchedAnnotationType, idModule } from '@label/core';
import { IconButton } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';

export { DeleteAnnotationButton };

function DeleteAnnotationButton(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  onClick: () => void;
  shouldApplyEverywhere: boolean;
}): ReactElement {
  const annotatorState = props.annotatorStateHandler.get();

  return <IconButton color="secondary" hint={wordings.delete} iconName="delete" onClick={deleteAnnotation} />;

  function deleteAnnotation() {
    const newAnnotations = annotatorState.annotations.filter((annotation) =>
      props.shouldApplyEverywhere
        ? annotation.entityId !== props.annotation.entityId
        : !idModule.lib.equalId(annotation._id, props.annotation._id),
    );

    const newAnnotatorState = { ...annotatorState, annotations: newAnnotations };
    props.annotatorStateHandler.set(newAnnotatorState);

    props.onClick();
  }
}
