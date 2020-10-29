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
  const style = buildStyle();
  const annotatorState = props.annotatorStateHandler.get();
  const categories = uniq(annotatorState.annotations.map((annotation) => annotation.category));

  return (
    <TooltipMenu anchorElement={props.anchorText} onClose={props.onClose}>
      <LayoutGrid style={style.annotationCreationTooltipMenu}>
        <LayoutGrid>
          <Dropdown items={categories} label={wordings.category} onChange={createAnnotation}></Dropdown>
        </LayoutGrid>
      </LayoutGrid>
    </TooltipMenu>
  );

  function buildStyle() {
    return {
      annotationCreationTooltipMenu: {
        padding: '0px 10px',
      },
    };
  }

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
