import React, { ReactElement, useState } from 'react';
import { uniq } from 'lodash';
import { annotationModule, annotationTextDetector } from '@label/core';
import { Checkbox, LabelledDropdown, LayoutGrid, Text, TooltipMenu } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';

export { AnnotationCreationTooltipMenu };

function AnnotationCreationTooltipMenu(props: {
  anchorText: Element;
  annotatorStateHandler: annotatorStateHandlerType;
  annotationText: string;
  annotationIndex: number;
  onClose: () => void;
}): ReactElement {
  const [shouldApplyEverywhere, setShouldApplyEverywhere] = useState(true);
  const annotatorState = props.annotatorStateHandler.get();
  const categories = uniq(annotatorState.annotations.map((annotation) => annotation.category));
  const annotationTextsAndIndices = annotationTextDetector.detectAnnotationTextsAndIndices(
    annotatorState.document.text,
    props.annotationText,
    annotatorState.annotations,
  );

  return (
    <TooltipMenu anchorElement={props.anchorText} onClose={props.onClose}>
      <LayoutGrid container direction="column" alignItems="center">
        <LayoutGrid item>
          <Text>{props.annotationText}</Text>
        </LayoutGrid>
        <LayoutGrid item>
          <Text>
            {annotationTextsAndIndices.length} {wordings.identicalOccurrencesSpotted}
          </Text>
        </LayoutGrid>
        <LayoutGrid item>
          <Checkbox
            defaultChecked={shouldApplyEverywhere}
            onChange={(checked: boolean) => setShouldApplyEverywhere(checked)}
            text={wordings.applyEveryWhere}
          ></Checkbox>
        </LayoutGrid>
        <LayoutGrid item>
          <LabelledDropdown
            items={categories.map((category) => ({ value: category, displayedText: category }))}
            label={wordings.category}
            onChange={applyAnnotationCreation}
          />
        </LayoutGrid>
      </LayoutGrid>
    </TooltipMenu>
  );

  function applyAnnotationCreation(category: string) {
    const newAnnotations = createAnnotations(category);

    props.annotatorStateHandler.set({
      ...annotatorState,
      annotations: [...newAnnotations, ...annotatorState.annotations],
    });

    props.onClose();
  }

  function createAnnotations(category: string) {
    if (shouldApplyEverywhere) {
      return annotationModule.lib.fetchedAnnotationHandler.createAll(category, annotationTextsAndIndices);
    } else {
      return [
        annotationModule.lib.fetchedAnnotationHandler.create(category, props.annotationIndex, props.annotationText),
      ];
    }
  }
}
