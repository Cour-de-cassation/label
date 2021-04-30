import React, { useState } from 'react';
import { apiRouteOutType } from '@label/core';
import { Table, tableRowFieldType } from '../../../components';
import { wordings } from '../../../wordings';
import { apiCaller } from '../../../api';
import { PasswordResetPopup } from './PasswordResetPopup';

export { AgentsTable };

function AgentsTable(props: {
  fields: Array<tableRowFieldType<apiRouteOutType<'get', 'usersWithDetails'>[number]>>;
  usersWithDetails: apiRouteOutType<'get', 'usersWithDetails'>;
}) {
  const [passwordReset, setPasswordReset] = useState<string | undefined>();
  const styles = buildStyles();

  return (
    <div style={styles.container}>
      {!!passwordReset && <PasswordResetPopup password={passwordReset} onClose={() => setPasswordReset(undefined)} />}
      <Table fields={props.fields} data={props.usersWithDetails} buildOptionItems={buildOptionItems} />
    </div>
  );

  function buildOptionItems(userWithDetails: apiRouteOutType<'get', 'usersWithDetails'>[number]) {
    return [
      {
        text: wordings.agentsPage.table.optionItems.resetPassword,
        onClick: async () => {
          const { data: newPassword } = await apiCaller.post<'resetPassword'>('resetPassword', {
            userId: userWithDetails.user._id,
          });
          setPasswordReset(newPassword);
        },
        iconName: 'alert' as const,
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
