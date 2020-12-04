import { useState } from 'react';
import { useDocumentViewerModeHandler } from '../../../../services/documentViewerMode';
import { splittedTextByLineType } from '../lib';

export { useEntityEntryHandler };

export type { entityEntryHandlerType };

type entityEntryHandlerType = ReturnType<typeof useEntityEntryHandler>;

function useEntityEntryHandler(splittedTextByLine: splittedTextByLineType) {
  const [entityFocused, setEntityFocused] = useState<string | undefined>(undefined);
  const documentViewerModeHandler = useDocumentViewerModeHandler();

  return {
    isFocused: (entityId: string) => entityFocused === entityId,
    isSelected,
    setFocus: (entityId?: string) => setEntityFocused(entityId),
    setSelected,
  };

  function setSelected(entityId?: string) {
    if (entityId) {
      const entityLines = filterLineByEntityId(entityId, splittedTextByLine).map(({ line }) => line);
      documentViewerModeHandler.setOccurrenceMode(entityId, entityLines);
    } else {
      documentViewerModeHandler.resetViewerMode();
    }
  }

  function isSelected(entityId: string) {
    const selectedEntityId =
      documentViewerModeHandler.documentViewerMode.kind === 'occurrence'
        ? documentViewerModeHandler.documentViewerMode.entityId
        : undefined;

    return selectedEntityId === entityId;
  }

  function filterLineByEntityId(entityId: string, splittedTextByLine: splittedTextByLineType): splittedTextByLineType {
    return splittedTextByLine.filter(({ content }) =>
      content.some((chunk) => {
        switch (chunk.type) {
          case 'annotation':
            return chunk.annotation.entityId === entityId;
          case 'text':
            return false;
        }
      }),
    );
  }
}
