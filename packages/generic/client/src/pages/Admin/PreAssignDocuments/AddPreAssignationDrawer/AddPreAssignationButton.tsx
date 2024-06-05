import React, { useState } from 'react';
import { ButtonWithIcon } from 'pelta-design-system';
import { wordings } from '../../../../wordings';
import { AddWorkingUserDrawer } from './AddPreAssignationDrawer';
import { userType } from '@label/core';

export { AddPreAssignationButton };

function AddPreAssignationButton(props: { refetch: () => void; users: Array<Pick<userType, '_id' | 'name'>> }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <ButtonWithIcon
        onClick={() => setIsDrawerOpen(true)}
        text={wordings.preAssignDocumentsPage.createPreAssignationDrawer.title}
        iconName="plus"
      />

      <AddWorkingUserDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        refetch={props.refetch}
        users={props.users}
      />
    </>
  );
}
