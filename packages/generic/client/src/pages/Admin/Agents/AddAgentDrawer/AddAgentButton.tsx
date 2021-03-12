import React, { useState } from 'react';
import { ButtonWithIcon } from '../../../../components';
import { wordings } from '../../../../wordings';
import { AddAgentDrawer } from './AddAgentDrawer';

export { AddAgentButton };

function AddAgentButton() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <>
      <ButtonWithIcon
        onClick={() => setIsDrawerOpen(true)}
        text={wordings.agentsPage.createAgentDrawer.title}
        iconName="addPerson"
      />

      <AddAgentDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
