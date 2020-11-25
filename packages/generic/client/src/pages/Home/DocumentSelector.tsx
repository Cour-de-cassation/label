import React from 'react';
import { LayoutGrid } from '../../components';

export { DocumentSelector };

function DocumentSelector(props: { onSelectDocument: () => Promise<void> }) {
  return (
    <LayoutGrid>
      Ecran de sélection : <button onClick={props.onSelectDocument}>Suivant</button>
    </LayoutGrid>
  );
}
