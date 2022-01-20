import React, { useState } from 'react';
import { ButtonWithIcon } from 'pelta-design-system';
import { wordings } from '../../../../wordings';
import { AddWorkingUserDrawer } from './AddUserDrawer';

export { AddWorkingUserButton };

function AddWorkingUserButton(props: { refetch: () => void }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <ButtonWithIcon
        onClick={() => setIsDrawerOpen(true)}
        text={wordings.workingUsersPage.createWorkingUserDrawer.title}
        iconName="addPerson"
      />

      <AddWorkingUserDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} refetch={props.refetch} />
    </>
  );
}
