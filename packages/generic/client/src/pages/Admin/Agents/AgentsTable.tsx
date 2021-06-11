import React, { useState } from 'react';
import { apiRouteOutType, userType } from '@label/core';
import { ConfirmationPopup, Table, tableRowFieldType } from '../../../components';
import { wordings } from '../../../wordings';
import { apiCaller } from '../../../api';
import { PasswordResetSuccessPopup } from './PasswordResetSuccessPopup';

export { AgentsTable };

function AgentsTable(props: {
  fields: Array<tableRowFieldType<apiRouteOutType<'get', 'usersWithDetails'>[number]>>;
  usersWithDetails: apiRouteOutType<'get', 'usersWithDetails'>;
}) {
  const [newPassword, setNewPassword] = useState<string | undefined>();
  const [resetPasswordUserId, setResetPasswordUserId] = useState<userType['_id'] | undefined>();
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
      <Table fields={props.fields} data={props.usersWithDetails} buildOptionItems={buildOptionItems} />
    </div>
  );

  function buildOnConfirmResetPassword(resetPasswordUserId: userType['_id']) {
    return () => {
      resetPasswordForUserId(resetPasswordUserId);
      setResetPasswordUserId(undefined);
    };
  }

  async function resetPasswordForUserId(userId: userType['_id']) {
    const { data: newPassword } = await apiCaller.post<'resetPassword'>('resetPassword', {
      userId,
    });
    setNewPassword(newPassword);
  }

  function buildOptionItems(userWithDetails: apiRouteOutType<'get', 'usersWithDetails'>[number]) {
    return [
      {
        text: wordings.agentsPage.table.optionItems.resetPassword,
        onClick: async () => setResetPasswordUserId(userWithDetails.user._id),
        iconName: 'key' as const,
      },
    ];
  }

  function buildStyles() {
    return {
      container: {
        height: '100%',
      },
    };
  }
}
