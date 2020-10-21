import React, { ReactElement } from 'react';
import { annotationModule, fetchedAnnotationType } from '@label/core';
import { Button, Dropdown, LayoutGrid } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';

export { AnnotationTooltipMenuLinkerSection };

function AnnotationTooltipMenuLinkerSection(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  disabled: boolean;
}): ReactElement {
  const annotatorState = props.annotatorStateHandler.get();
  const linkableAnnotations = annotationModule.lib.annotationLinker.getLinkableAnnotations(
    props.annotation,
    annotatorState.annotations,
  );
  const isLinked = annotationModule.lib.annotationLinker.isLinked(props.annotation, annotatorState.annotations);

  return (
    <span>
      {isLinked && (
        <LayoutGrid>
          <Button onClick={unlinkAnnotation}>Dissocier</Button>
        </LayoutGrid>
      )}
      {linkableAnnotations.length !== 0 && (
        <LayoutGrid>
          <Dropdown
            disabled={props.disabled}
            items={linkableAnnotations.map((annotation) => annotation.text)}
            label={wordings.associateTo}
            onChange={linkToAnnotation}
          ></Dropdown>
        </LayoutGrid>
      )}
    </span>
  );

  function linkToAnnotation(text: string) {
    const annotationToLinkTo = linkableAnnotations.find((annotation) => annotation.text === text);

    if (annotationToLinkTo) {
      const newAnnotatorState = {
        ...annotatorState,
        annotations: annotationModule.lib.annotationLinker.link(
          props.annotation,
          annotationToLinkTo,
          annotatorState.annotations,
        ),
      };

      props.annotatorStateHandler.set(newAnnotatorState);
    }
  }

  function unlinkAnnotation() {
    const newAnnotatorState = {
      ...annotatorState,
      annotations: annotationModule.lib.annotationLinker.unlink(props.annotation, annotatorState.annotations),
    };

    props.annotatorStateHandler.set(newAnnotatorState);
  }
}
