import React from 'react';
import { annotationHandler, fetchedAnnotationType } from '@label/core';
import { ComponentsList, IconButton, LinkAnnotationDropdown } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { useCustomTheme } from '../../../../../styles';
import { wordings } from '../../../../../wordings';
import { entityEntryHandlerType } from '../useEntityEntryHandler';
import { UnlinkAnnotationDropdown } from './UnlinkAnnotationDropdown';

export { CategoryTableEntryActionButtons };

const CATEGORY_TABLE_ENTRY_BUTTON_SIZE = 32;

function CategoryTableEntryActionButtons(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  entityAnnotation: fetchedAnnotationType;
  entityEntryHandler: entityEntryHandlerType;
}) {
  const theme = useCustomTheme();
  const annotatorState = props.annotatorStateHandler.get();

  return (
    <ComponentsList
      components={[
        <LinkAnnotationDropdown
          annotatorStateHandler={props.annotatorStateHandler}
          annotation={props.entityAnnotation}
          buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
          onClick={() => props.entityEntryHandler.setFocus(props.entityAnnotation.entityId)}
          onClose={() => props.entityEntryHandler.setFocus(undefined)}
        />,
        <UnlinkAnnotationDropdown
          annotatorStateHandler={props.annotatorStateHandler}
          annotation={props.entityAnnotation}
          buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
          onClick={() => props.entityEntryHandler.setFocus(props.entityAnnotation.entityId)}
          onClose={() => props.entityEntryHandler.setFocus(undefined)}
        />,
        <IconButton
          buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
          color="secondary"
          hint={wordings.delete}
          iconName="delete"
          onClick={deleteAnnotations}
        />,
      ]}
      spaceBetweenComponents={theme.spacing}
    />
  );

  function deleteAnnotations() {
    const newAnnotations = annotationHandler.deleteByEntityId(
      annotatorState.annotations,
      props.entityAnnotation.entityId,
    );

    const newAnnotatorState = { ...annotatorState, annotations: newAnnotations };
    props.annotatorStateHandler.set(newAnnotatorState);
  }
}
