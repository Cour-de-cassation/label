import React, { ReactElement, useState } from 'react';
import { uniq } from 'lodash';
import { idModule } from '@label/core';
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
  const [shouldApplyEverywhere, setShouldApplyEverywhere] = useState(false);
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
          <Checkbox
            onChange={(_, checked: boolean) => setShouldApplyEverywhere(checked)}
            text={wordings.applyEveryWhere}
          ></Checkbox>
        </LayoutGrid>
        <LayoutGrid>
          <Dropdown
            defaultItem={props.annotation.category}
            items={categories}
            onChange={changeAnnotationCategory}
          ></Dropdown>
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

  function changeAnnotationCategory(newCategory: string) {
    const annotationsToChange = shouldApplyEverywhere
      ? annotatorState.annotations.filter((annotation) => annotation.entityId === props.annotation.entityId)
      : [props.annotation];

    const otherAnnotations = shouldApplyEverywhere
      ? removeAllOccurences(props.annotation, annotatorState.annotations)
      : removeOneOccurence(props.annotation, annotatorState.annotations);

    const changedAnnotations = annotationsToChange.map((annotation) => ({ ...annotation, category: newCategory }));
    const newAnnotatorState = { ...annotatorState, annotations: [...changedAnnotations, ...otherAnnotations] };
    props.annotatorStateHandler.set(newAnnotatorState);
  }

  function deleteAnnotation() {
    props.onClose();

    const newAnnotations = shouldApplyEverywhere
      ? removeAllOccurences(props.annotation, annotatorState.annotations)
      : removeOneOccurence(props.annotation, annotatorState.annotations);
    const newAnnotatorState = { ...annotatorState, annotations: newAnnotations };
    props.annotatorStateHandler.set(newAnnotatorState);
  }

  function removeOneOccurence(annotationToRemove: fetchedAnnotationType, annotations: fetchedAnnotationType[]) {
    return annotations.filter((annotation) => !idModule.lib.equalId(annotation._id, annotationToRemove._id));
  }

  function removeAllOccurences(annotationToRemove: fetchedAnnotationType, annotations: fetchedAnnotationType[]) {
    return annotations.filter((annotation) => annotation.entityId !== annotationToRemove.entityId);
  }
}
