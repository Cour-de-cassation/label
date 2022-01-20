import React from 'react';
import { annotationType } from '@label/core';
import {
  ChangeAnnotationCategoryDropdown,
  LinkAnnotationDropdown,
  UnlinkAnnotationDropdown,
} from '../../../../../components';
import { useCustomTheme, ComponentsList } from 'pelta-design-system';
import { entityEntryHandlerType } from '../useEntityEntryHandler';
import { CategoryTableEntryDeleteAnnotationDropdown } from './CategoryTableEntryDeleteAnnotationDropdown';

export { CategoryTableEntryActionButtons };

const CATEGORY_TABLE_ENTRY_BUTTON_SIZE = 32;

function CategoryTableEntryActionButtons(props: {
  entityAnnotation: annotationType;
  entityEntryHandler: entityEntryHandlerType;
}) {
  const theme = useCustomTheme();

  return (
    <ComponentsList
      components={[
        <ChangeAnnotationCategoryDropdown
          annotation={props.entityAnnotation}
          buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
          origin="panel"
        />,
        <LinkAnnotationDropdown
          annotation={props.entityAnnotation}
          buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
          origin="panel"
          onClick={() => props.entityEntryHandler.setFocus(props.entityAnnotation.entityId)}
          onClose={() => props.entityEntryHandler.setFocus(undefined)}
        />,
        <UnlinkAnnotationDropdown
          annotation={props.entityAnnotation}
          buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
          origin="panel"
          onClick={() => props.entityEntryHandler.setFocus(props.entityAnnotation.entityId)}
          onClose={() => props.entityEntryHandler.setFocus(undefined)}
        />,
        <CategoryTableEntryDeleteAnnotationDropdown
          buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
          entityAnnotation={props.entityAnnotation}
        />,
      ]}
      spaceBetweenComponents={theme.spacing}
    />
  );
}
