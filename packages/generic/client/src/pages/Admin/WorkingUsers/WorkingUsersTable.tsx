import React, { useState } from 'react';
import { apiRouteOutType, userType } from '@label/core';
import { ConfirmationPopup, Table, tableRowFieldType } from 'pelta-design-system';
import { wordings } from '../../../wordings';
import { apiCaller } from '../../../api';
import { PasswordResetSuccessPopup } from './PasswordResetSuccessPopup';

export { WorkingUsersTable };

function WorkingUsersTable(props: {
  fields: Array<tableRowFieldType<apiRouteOutType<'get', 'workingUsers'>[number]>>;
  refetch: () => void;
  workingUsers: apiRouteOutType<'get', 'workingUsers'>;
}) {
  const [newPassword, setNewPassword] = useState<string | undefined>();
  const [resetPasswordUserId, setResetPasswordUserId] = useState<userType['_id'] | undefined>();
  const [deleteUserId, setDeleteUserId] = useState<userType['_id'] | undefined>();
  const styles = buildStyles();

  return (
    <div style={styles.container}>
      {!!newPassword && <PasswordResetSuccessPopup password={newPassword} onClose={() => setNewPassword(undefined)} />}
      {!!resetPasswordUserId && (
        <ConfirmationPopup
          onCancel={() => setResetPasswordUserId(undefined)}
          onConfirm={buildOnConfirmResetPassword(resetPasswordUserId)}
          text={wordings.workingUsersPage.table.passwordResetConfirmationPopup.text}
        />
      )}
      {!!deleteUserId && (
        <ConfirmationPopup
          onCancel={() => setDeleteUserId(undefined)}
          onConfirm={buildOnConfirmDeleteUser(deleteUserId)}
          text={wordings.workingUsersPage.table.deleteUserConfirmationPopup.text}
        />
      )}
      <Table
        isRowMinored={isRowMinored}
        fields={props.fields}
        data={props.workingUsers}
        buildOptionItems={buildOptionItems}
      />
    </div>
  );

  function isRowMinored(workingUser: apiRouteOutType<'get', 'workingUsers'>[number]) {
    return !workingUser.isActivated;
  }

  function buildOnConfirmResetPassword(resetPasswordUserId: userType['_id']) {
    return () => {
      resetPasswordForUserId(resetPasswordUserId);
      setResetPasswordUserId(undefined);
    };
  }

  function buildOnConfirmDeleteUser(deleteUserId: userType['_id']) {
    return async () => {
      await apiCaller.post<'setDeletionDateForUser'>('setDeletionDateForUser', { userId: deleteUserId });
      setDeleteUserId(undefined);
      props.refetch();
    };
  }

  async function resetPasswordForUserId(userId: userType['_id']) {
    const { data: newPassword } = await apiCaller.post<'resetPassword'>('resetPassword', {
      userId,
    });
    setNewPassword(newPassword);
  }

  function buildOptionItems(workingUser: apiRouteOutType<'get', 'workingUsers'>[number]) {
    const toggleIsActivatedOptionItem = buildToggleIsActivatedOptionItem(workingUser);
    return [
      {
        kind: 'text' as const,
        text: wordings.workingUsersPage.table.optionItems.resetPassword,
        onClick: async () => setResetPasswordUserId(workingUser._id),
        iconName: 'key' as const,
      },
      toggleIsActivatedOptionItem,
      {
        kind: 'text' as const,
        text: wordings.workingUsersPage.table.optionItems.delete,
        onClick: () => {
          setDeleteUserId(workingUser._id);
        },
        iconName: 'delete' as const,
      },
    ];
  }

  function buildToggleIsActivatedOptionItem(user: apiRouteOutType<'get', 'workingUsers'>[number]) {
    const iconName: 'lock' | 'unlock' = user.isActivated ? 'lock' : 'unlock';
    const onClick = async () => {
      await apiCaller.post<'setIsActivatedForUser'>('setIsActivatedForUser', {
        isActivated: !user.isActivated,
        userId: user._id,
      });
      props.refetch();
    };
    const text = user.isActivated
      ? wordings.workingUsersPage.table.optionItems.deactivate
      : wordings.workingUsersPage.table.optionItems.activate;
    return { kind: 'text' as const, iconName, text, onClick };
  }

  function buildStyles() {
    return {
      container: {
        height: '100%',
      },
    };
  }
}
