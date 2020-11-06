import React, { MouseEvent, ReactElement, useState } from 'react';
import { anonymizerType, fetchedAnnotationType, settingsModule } from '@label/core';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { AnnotationTooltipMenu } from './AnnotationTooltipMenu';
import { AnnotationTooltipSummary } from './AnnotationTooltipMenu/AnnotationTooltipSummary';

export { DocumentAnnotationText };

function DocumentAnnotationText(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
  isAnonymizedView: boolean;
}): ReactElement {
  const style = buildStyle();
  const [anchorElement, setAnchorElement] = useState<Element | undefined>(undefined);
  const [summaryAnchorElement, setSummaryAnchorElement] = useState<Element | undefined>(undefined);

  return (
    <span>
      <span
        onClick={(event: MouseEvent<Element>) => openTooltipMenu(event.currentTarget)}
        onMouseOver={(event: MouseEvent<Element>) => openTooltipSummary(event.currentTarget)}
        style={style.annotationText}
      >
        {props.isAnonymizedView ? props.anonymizer.anonymize(props.annotation) : props.annotation.text}
      </span>
      <AnnotationTooltipSummary
        anchorAnnotation={summaryAnchorElement}
        annotatorStateHandler={props.annotatorStateHandler}
        annotation={props.annotation}
        anonymizer={props.anonymizer}
        isAnonymizedView={props.isAnonymizedView}
        onClickOnAnchorAnnotation={() => openTooltipMenu(summaryAnchorElement)}
        onClose={closeTooltipSummary}
      />
      <AnnotationTooltipMenu
        anchorAnnotation={anchorElement}
        annotatorStateHandler={props.annotatorStateHandler}
        annotation={props.annotation}
        anonymizer={props.anonymizer}
        isAnonymizedView={props.isAnonymizedView}
        onClose={closeTooltipMenu}
      />
    </span>
  );

  function buildStyle() {
    return {
      annotationText: {
        backgroundColor: settingsModule.lib.getAnnotationCategoryColor(
          props.annotation.category,
          props.annotatorStateHandler.get().settings,
        ),
        cursor: 'pointer',
        padding: '0px 2px',
        borderRadius: '3px',
      },
    };
  }

  function openTooltipSummary(element: Element | undefined) {
    setSummaryAnchorElement(element);
  }

  function closeTooltipSummary() {
    setSummaryAnchorElement(undefined);
  }

  function openTooltipMenu(element: Element | undefined) {
    setAnchorElement(element);
    closeTooltipSummary();
  }

  function closeTooltipMenu() {
    setAnchorElement(undefined);
  }
}
