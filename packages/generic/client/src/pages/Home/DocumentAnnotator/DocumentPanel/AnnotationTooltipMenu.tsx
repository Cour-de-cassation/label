import React, { ReactElement, useState } from 'react';
import { uniq } from 'lodash';
import { areMongoIdEqual } from '@label/core';
import { Button, Checkbox, Dropdown, LayoutGrid, Text, TooltipMenu } from '../../../../components';
import { fetchedAnnotationType } from '../../../../types';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { fillTemplate, wordings } from '../../../../wordings';

export { AnnotationTooltipMenu };

function AnnotationTooltipMenu(props: {
  anchorAnnotation: Element | undefined;
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  onClose: () => void;
  open: boolean;
}): ReactElement {
  const style = buildStyle();
  const annotatorState = props.annotatorStateHandler.get();
  const categories = uniq(annotatorState.annotations.map((annotation) => annotation.category));
  const nbOfEntities = annotatorState.annotations.filter(
    (annotation) => annotation.entityId === props.annotation.entityId,
  ).length;

  return (
    <TooltipMenu anchorEl={props.anchorAnnotation} open={props.open} onClose={props.onClose}>
      <LayoutGrid style={style.annotationTooltipMenu}>
        <LayoutGrid>
          <Text>{fillTemplate(wordings.nOccurencesToObliterate, JSON.stringify(nbOfEntities))}</Text>
        </LayoutGrid>
        <LayoutGrid>
          <Checkbox text={wordings.applyEveryWhere}></Checkbox>
        </LayoutGrid>
        <LayoutGrid>
          <Dropdown defaultItem={props.annotation.category} items={categories} onChange={() => console.log}></Dropdown>
        </LayoutGrid>
        <LayoutGrid>
          <Button onClick={deleteAnnotation}>{wordings.delete}</Button>
        </LayoutGrid>
      </LayoutGrid>
    </TooltipMenu>
  );

  function buildStyle() {
    return {
      annotationTooltipMenu: {
        padding: '0px 10px',
      },
    };
  }

  function deleteAnnotation() {
    props.onClose();

    const newAnnotations = annotatorState.annotations.filter(
      (annotation) => !areMongoIdEqual(annotation._id, props.annotation._id),
    );
    const newAnnotatorState = { ...annotatorState, annotations: newAnnotations };
    props.annotatorStateHandler.set(newAnnotatorState);
  }
}
