import React, { ReactElement, useState } from 'react';
import { uniq } from 'lodash';
import { annotationModule } from '@label/core';
import { Checkbox, Dropdown, LayoutGrid, TooltipMenu } from '../../../../../components';
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
  const [shouldApplyEverywhere, setShouldApplyEverywhere] = useState(true);
  const annotatorState = props.annotatorStateHandler.get();
  const categories = uniq(annotatorState.annotations.map((annotation) => annotation.category));
  return (
    <TooltipMenu anchorElement={props.anchorText} onClose={props.onClose}>
      <LayoutGrid>
        <LayoutGrid>
          <Checkbox
            defaultChecked={shouldApplyEverywhere}
            onChange={(checked: boolean) => setShouldApplyEverywhere(checked)}
            text={wordings.applyEveryWhere}
          ></Checkbox>
        </LayoutGrid>
        <LayoutGrid>
          <Dropdown
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
      return annotationModule.lib.fetchedAnnotationHandler.createAll(
        category,
        annotatorState.document._id,
        annotatorState.document.text,
        props.annotationText,
      );
    } else {
      return [
        annotationModule.lib.fetchedAnnotationHandler.create(
          category,
          annotatorState.document._id,
          props.annotationIndex,
          props.annotationText,
        ),
      ];
    }
  }
}
