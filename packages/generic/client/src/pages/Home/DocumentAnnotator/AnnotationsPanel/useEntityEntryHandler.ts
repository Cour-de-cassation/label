import { useState } from 'react';

export { useEntityEntryHandler };

export type { entityEntryHandlerType };

type entityEntryHandlerType = ReturnType<typeof useEntityEntryHandler>;

function useEntityEntryHandler(onEntitySelection: (entityId: string | undefined) => void) {
  const [entityFocused, setEntityFocused] = useState<string | undefined>(undefined);
  const [entitySelected, setEntitySelected] = useState<string | undefined>(undefined);

  return {
    focusEntity: (entityId: string) => setEntityFocused(entityId),
    getEntityFocused: () => entityFocused,
    getEntitySelected: () => entitySelected,
    handleEntitySelection,
    unfocusEntity: () => setEntityFocused(undefined),
  };

  function handleEntitySelection(entityId: string | undefined) {
    setEntitySelected(entityId);
    onEntitySelection(entityId);
  }
}
