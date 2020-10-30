import React, { ReactElement } from 'react';
import { uniq } from 'lodash';
import { annotationModule } from '@label/core';
import { Dropdown, LayoutGrid, TooltipMenu } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';

export { AnnotationCreationTooltipMenu };

function AnnotationCreationTooltipMenu(props: {
  anchorText: Element | undefined;
  annotatorStateHandler: annotatorStateHandlerType;
  annotationText: string;
  annotationIndex: number;
  onClose: () => void;
}): ReactElement {
  const annotatorState = props.annotatorStateHandler.get();
  const categories = uniq(annotatorState.annotations.map((annotation) => annotation.category));

  return (
    <TooltipMenu anchorElement={props.anchorText} onClose={props.onClose}>
      <LayoutGrid>
        <LayoutGrid>
          <Dropdown
            items={categories.map((category) => ({ value: category, displayedText: category }))}
            label={wordings.category}
            onChange={createAnnotation}
          ></Dropdown>
        </LayoutGrid>
      </LayoutGrid>
    </TooltipMenu>
  );

  function createAnnotation(category: string) {
    const newAnnotation = annotationModule.lib.fetchedAnnotationHandler.create(
      category,
      annotatorState.document._id,
      props.annotationIndex,
      props.annotationText,
    );

    const newAnnotatorState = { ...annotatorState, annotations: [newAnnotation, ...annotatorState.annotations] };
    props.annotatorStateHandler.set(newAnnotatorState);

    props.onClose();
  }
}
