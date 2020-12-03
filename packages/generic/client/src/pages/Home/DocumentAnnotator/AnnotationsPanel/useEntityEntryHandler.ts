import { useState } from 'react';
import { useDocumentViewerModeHandler } from '../../../../services/documentViewerMode';

export { useEntityEntryHandler };

export type { entityEntryHandlerType };

type entityEntryHandlerType = ReturnType<typeof useEntityEntryHandler>;

function useEntityEntryHandler() {
  const [entityFocused, setEntityFocused] = useState<string | undefined>(undefined);
  const documentViewerModeHandler = useDocumentViewerModeHandler();

  return {
    focusEntity: (entityId: string) => setEntityFocused(entityId),
    getEntityFocused: () => entityFocused,
    getEntitySelected,
    handleEntitySelection,
    unfocusEntity: () => setEntityFocused(undefined),
  };

  function handleEntitySelection(entity: { id: string; lineNumbers: number[] } | undefined) {
    if (entity) {
      documentViewerModeHandler.setOccurrenceMode(entity.id, entity.lineNumbers);
    } else {
      documentViewerModeHandler.resetViewerMode();
    }
  }

  function getEntitySelected() {
    return documentViewerModeHandler.documentViewerMode.kind === 'occurrence'
      ? documentViewerModeHandler.documentViewerMode.entityId
      : undefined;
  }
}
