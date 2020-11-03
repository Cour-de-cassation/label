import React, { ReactElement, useState } from 'react';
import { uniq } from 'lodash';
import { annotationModule, fetchedAnnotationType, idModule, settingsModule } from '@label/core';
import { Button, Checkbox, Dropdown, CategoryIcon, LayoutGrid, Text, TooltipMenu } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { fillTemplate, wordings } from '../../../../../wordings';
import { AnnotationTooltipMenuLinkerSection } from './AnnotationTooltipMenuLinkerSection';

export { AnnotationTooltipMenu };

function AnnotationTooltipMenu(props: {
  anchorAnnotation: Element | undefined;
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  onClose: () => void;
}): ReactElement {
  const style = buildStyle();
  const [shouldApplyEverywhere, setShouldApplyEverywhere] = useState(true);
  const annotatorState = props.annotatorStateHandler.get();
  const categories = uniq(annotatorState.annotations.map((annotation) => annotation.category));
  const nbOfEntities = annotatorState.annotations.filter(
    (annotation) => annotation.entityId === props.annotation.entityId,
  ).length;

  return (
    <TooltipMenu anchorElement={props.anchorAnnotation} onClose={props.onClose}>
      <LayoutGrid>
        <LayoutGrid container alignItems="center">
          <LayoutGrid>
            <CategoryIcon
              annotatorStateHandler={props.annotatorStateHandler}
              category={props.annotation.category}
              iconSize={30}
            />
          </LayoutGrid>
          <LayoutGrid>
            <Text style={style.categoryText}>
              {settingsModule.lib.getAnnotationCategoryText(
                props.annotation.category,
                props.annotatorStateHandler.get().settings,
              )}
            </Text>
          </LayoutGrid>
        </LayoutGrid>
        <LayoutGrid>
          <Text>{fillTemplate(wordings.nOccurencesToObliterate, JSON.stringify(nbOfEntities))}</Text>
        </LayoutGrid>
        <LayoutGrid>
          <Checkbox
            defaultChecked={shouldApplyEverywhere}
            onChange={(checked: boolean) => setShouldApplyEverywhere(checked)}
            text={wordings.applyEveryWhere}
          ></Checkbox>
        </LayoutGrid>
        <LayoutGrid>
          <Dropdown
            defaultItem={props.annotation.category}
            items={categories.map((category) => ({ value: category, displayedText: category }))}
            label={wordings.category}
            onChange={changeAnnotationCategory}
          ></Dropdown>
        </LayoutGrid>
        <AnnotationTooltipMenuLinkerSection
          annotatorStateHandler={props.annotatorStateHandler}
          annotation={props.annotation}
          disabled={!shouldApplyEverywhere}
        />
        <LayoutGrid>
          <Button onClick={deleteAnnotation}>{wordings.delete}</Button>
        </LayoutGrid>
      </LayoutGrid>
    </TooltipMenu>
  );

  function buildStyle() {
    return {
      categoryText: {
        marginLeft: '12px',
      },
    };
  }

  function changeAnnotationCategory(newCategory: string) {
    const annotationsToUpdate = shouldApplyEverywhere
      ? annotatorState.annotations.filter((annotation) => annotation.entityId === props.annotation.entityId)
      : [props.annotation];

    const otherAnnotations = shouldApplyEverywhere
      ? removeAllOccurences(props.annotation, annotatorState.annotations)
      : removeOneOccurence(props.annotation, annotatorState.annotations);

    const updatedAnnotations = annotationModule.lib.fetchedAnnotationHandler.updateMany(
      annotationsToUpdate,
      (annotation) => ({
        ...annotation,
        category: newCategory,
      }),
    );

    const newAnnotatorState = { ...annotatorState, annotations: [...updatedAnnotations, ...otherAnnotations] };
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
