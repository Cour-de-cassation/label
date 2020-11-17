import React from 'react';
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
  entityId: string;
  entityEntryHandler: entityEntryHandlerType;
}) {
  return isHovered() ? (
    <CategoryTableEntryHovered
      annotatorStateHandler={props.annotatorStateHandler}
      anonymizer={props.anonymizer}
      entityId={props.entityId}
      entityEntryHandler={props.entityEntryHandler}
      hideActionButtons={() => props.entityEntryHandler.unfocusEntity()}
    />
  ) : isSelected() ? (
    <CategoryTableEntrySelected
      annotatorStateHandler={props.annotatorStateHandler}
      anonymizer={props.anonymizer}
      entityId={props.entityId}
      entityEntryHandler={props.entityEntryHandler}
      showActionButtons={() => props.entityEntryHandler.focusEntity(props.entityId)}
    />
  ) : (
    <CategoryTableEntryDefault
      annotatorStateHandler={props.annotatorStateHandler}
      anonymizer={props.anonymizer}
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
