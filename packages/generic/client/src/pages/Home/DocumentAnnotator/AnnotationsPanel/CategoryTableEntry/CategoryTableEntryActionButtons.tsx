import React from 'react';
import { annotationHandler, annotationType } from '@label/core';
import {
  ComponentsList,
  IconButton,
  LinkAnnotationDropdown,
  UnlinkAnnotationDropdown,
} from '../../../../../components';
import { useAnnotatorStateHandler } from '../../../../../services/annotatorState';
import { useMonitoring } from '../../../../../services/monitoring';
import { useCustomTheme } from '../../../../../styles';
import { wordings } from '../../../../../wordings';
import { ChangeAnnotationCategoryDropdown } from '../../DocumentPanel/AnnotationTooltipMenu/ChangeAnnotationCategoryDropdown';
import { entityEntryHandlerType } from '../useEntityEntryHandler';

export { CategoryTableEntryActionButtons };

const CATEGORY_TABLE_ENTRY_BUTTON_SIZE = 32;

function CategoryTableEntryActionButtons(props: {
  entityAnnotation: annotationType;
  entityEntryHandler: entityEntryHandlerType;
}) {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const { addMonitoringEntry } = useMonitoring();
  const theme = useCustomTheme();
  const annotatorState = annotatorStateHandler.get();

  return (
    <ComponentsList
      components={[
        <ChangeAnnotationCategoryDropdown
          annotation={props.entityAnnotation}
          buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
          context="panel"
        />,
        <LinkAnnotationDropdown
          annotation={props.entityAnnotation}
          buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
          context="panel"
          onClick={() => props.entityEntryHandler.setFocus(props.entityAnnotation.entityId)}
          onClose={() => props.entityEntryHandler.setFocus(undefined)}
        />,
        <UnlinkAnnotationDropdown
          annotation={props.entityAnnotation}
          buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
          context="panel"
          onClick={() => props.entityEntryHandler.setFocus(props.entityAnnotation.entityId)}
          onClose={() => props.entityEntryHandler.setFocus(undefined)}
        />,
        <IconButton
          buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
          color="alert"
          hint={wordings.homePage.delete}
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
    annotatorStateHandler.set(newAnnotatorState);
    addMonitoringEntry({
      description: `panel_delete_all`,
      type: 'button',
    });
  }
}
