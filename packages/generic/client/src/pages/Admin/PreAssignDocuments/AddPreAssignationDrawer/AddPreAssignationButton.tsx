import React, { useState } from 'react';
import { ButtonWithIcon } from 'pelta-design-system';
import { wordings } from '../../../../wordings';

export { AddPreAssignationButton };

function AddPreAssignationButton(props: { refetch: () => void }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <ButtonWithIcon
        onClick={() => setIsDrawerOpen(true)}
        text={wordings.preAssignDocumentsPage.createPreAssignationDrawer.title}
        iconName="plus"
      />
    </>
  );
}
