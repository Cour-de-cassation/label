import React, { ReactElement } from 'react';
import { annotationLinkHandler, fetchedAnnotationType } from '@label/core';
import { IconDropdown } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';

export { UnlinkAnnotationDropdown };

const UNLINK_OPTION = ['__one__', '__all__'] as const;

function UnlinkAnnotationDropdown(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
}): ReactElement {
  const annotatorState = props.annotatorStateHandler.get();

  return (
    <IconDropdown
      disabled={isNotLinked()}
      hint={wordings.unlink}
      iconName="unlink"
      items={UNLINK_OPTION.map((option) => ({
        text: wordings.unlinkOption[option],
        value: option,
      }))}
      onChange={unlinkAnnotation}
    />
  );

  function isNotLinked() {
    return !annotationLinkHandler.isLinked(props.annotation, annotatorState.annotations);
  }

  function unlinkAnnotation(option: typeof UNLINK_OPTION[number]) {
    const newAnnotatorState = {
      ...annotatorState,
      annotations: computeNewAnnotations(option),
    };

    props.annotatorStateHandler.set(newAnnotatorState);
  }

  function computeNewAnnotations(option: typeof UNLINK_OPTION[number]) {
    switch (option) {
      case '__all__':
        return annotationLinkHandler.unlink(props.annotation, annotatorState.annotations);
      case '__one__':
        return annotationLinkHandler.unlinkByCategoryAndText(props.annotation, annotatorState.annotations);
    }
  }
}
