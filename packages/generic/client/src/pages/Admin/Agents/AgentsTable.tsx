import React, { useState } from 'react';
import { apiRouteOutType, userType } from '@label/core';
import { ConfirmationPopup, Table, tableRowFieldType } from '../../../components';
import { wordings } from '../../../wordings';
import { apiCaller } from '../../../api';
import { PasswordResetSuccessPopup } from './PasswordResetSuccessPopup';

export { AgentsTable };

function AgentsTable(props: {
  fields: Array<tableRowFieldType<apiRouteOutType<'get', 'usersWithDetails'>[number]>>;
  refetch: () => void;
  usersWithDetails: apiRouteOutType<'get', 'usersWithDetails'>;
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
          onClose={() => setResetPasswordUserId(undefined)}
          onConfirm={buildOnConfirmResetPassword(resetPasswordUserId)}
          text={wordings.agentsPage.table.passwordResetConfirmationPopup.text}
        />
      )}
      {!!deleteUserId && (
        <ConfirmationPopup
          onClose={() => setDeleteUserId(undefined)}
          onConfirm={buildOnConfirmDeleteUser(deleteUserId)}
          text={wordings.agentsPage.table.deleteUserConfirmationPopup.text}
        />
      )}
      <Table
        isRowMinored={isRowMinored}
        fields={props.fields}
        data={props.usersWithDetails}
        buildOptionItems={buildOptionItems}
      />
    </div>
  );

  function isRowMinored(userWithDetails: apiRouteOutType<'get', 'usersWithDetails'>[number]) {
    return !userWithDetails.user.isActivated;
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

  function buildOptionItems(userWithDetails: apiRouteOutType<'get', 'usersWithDetails'>[number]) {
    const toggleIsActivatedOptionItem = buildToggleIsActivatedOptionItem(userWithDetails.user);
    return [
      {
        text: wordings.agentsPage.table.optionItems.resetPassword,
        onClick: async () => setResetPasswordUserId(userWithDetails.user._id),
        iconName: 'key' as const,
      },
      toggleIsActivatedOptionItem,
      {
        text: wordings.agentsPage.table.optionItems.delete,
        onClick: () => {
          setDeleteUserId(userWithDetails.user._id);
        },
        iconName: 'delete' as const,
      },
    ];
  }

  function buildToggleIsActivatedOptionItem(user: apiRouteOutType<'get', 'usersWithDetails'>[number]['user']) {
    const iconName: 'lock' | 'unlock' = user.isActivated ? 'lock' : 'unlock';
    const onClick = async () => {
      await apiCaller.post<'setIsActivatedForUser'>('setIsActivatedForUser', {
        isActivated: !user.isActivated,
        userId: user._id,
      });
      props.refetch();
    };
    const text = user.isActivated
      ? wordings.agentsPage.table.optionItems.deactivate
      : wordings.agentsPage.table.optionItems.activate;
    return { iconName, text, onClick };
  }

  function buildStyles() {
    return {
      container: {
        height: '100%',
      },
    };
  }
}
