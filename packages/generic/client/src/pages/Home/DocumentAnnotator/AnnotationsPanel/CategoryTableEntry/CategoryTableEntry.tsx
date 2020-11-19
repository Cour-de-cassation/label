import React from 'react';
import { fetchedAnnotationType } from '@label/core';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { clientAnonymizerType } from '../../../../../types';
import { entityEntryHandlerType } from '../useEntityEntryHandler';
import { CategoryTableEntryDefault } from './CategoryTableEntryDefault';
import { CategoryTableEntryHovered } from './CategoryTableEntryHovered';
import { CategoryTableEntrySelected } from './CategoryTableEntrySelected';

export { CategoryTableEntry };

function CategoryTableEntry(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
  entityAnnotations: fetchedAnnotationType[];
  entityId: string;
  entityEntryHandler: entityEntryHandlerType;
}) {
  return isHovered() ? (
    <CategoryTableEntryHovered
      annotatorStateHandler={props.annotatorStateHandler}
      anonymizer={props.anonymizer}
      entityAnnotations={props.entityAnnotations}
      entityId={props.entityId}
      entityEntryHandler={props.entityEntryHandler}
      hideActionButtons={() => props.entityEntryHandler.unfocusEntity()}
      selected={isSelected()}
    />
  ) : isSelected() ? (
    <CategoryTableEntrySelected
      annotatorStateHandler={props.annotatorStateHandler}
      anonymizer={props.anonymizer}
      entityAnnotations={props.entityAnnotations}
      entityId={props.entityId}
      entityEntryHandler={props.entityEntryHandler}
      showActionButtons={() => props.entityEntryHandler.focusEntity(props.entityId)}
    />
  ) : (
    <CategoryTableEntryDefault
      annotatorStateHandler={props.annotatorStateHandler}
      anonymizer={props.anonymizer}
      entityAnnotations={props.entityAnnotations}
      entityId={props.entityId}
      showActionButtons={() => props.entityEntryHandler.focusEntity(props.entityId)}
    />
  );

  function isSelected() {
    return props.entityEntryHandler.getEntitySelected() === props.entityId;
  }

  function isHovered() {
    return props.entityEntryHandler.getEntityFocused() === props.entityId;
  }
}
