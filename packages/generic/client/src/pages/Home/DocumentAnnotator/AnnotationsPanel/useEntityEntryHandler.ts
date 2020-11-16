import { useState } from 'react';

export { useEntityEntryHandler };

export type { entityEntryHandlerType };

type entityEntryHandlerType = ReturnType<typeof useEntityEntryHandler>;

function useEntityEntryHandler(onClick: () => void) {
  const [entityFocused, setEntityFocused] = useState<string | undefined>(undefined);
  const [entitySelected, setEntitySelected] = useState<string | undefined>(undefined);

  return {
    focusEntity: (entityId: string) => setEntityFocused(entityId),
    getEntityFocused: () => entityFocused,
    getEntitySelected: () => entitySelected,
    selectEntity,
    unfocusEntity: () => setEntityFocused(undefined),
  };

  function selectEntity(entityId: string) {
    onClick();
    setEntitySelected(entityId);
  }
}
