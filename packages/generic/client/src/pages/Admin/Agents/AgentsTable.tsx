import React from 'react';
import { apiRouteOutType } from '@label/core';
import { Table, tableRowFieldType } from '../../../components';

export { AgentsTable };

function AgentsTable(props: {
  fields: Array<tableRowFieldType<apiRouteOutType<'get', 'usersWithDetails'>[number], string | number>>;
  usersWithDetails: apiRouteOutType<'get', 'usersWithDetails'>;
}) {
  const styles = buildStyles();

  return (
    <div style={styles.container}>
      <Table isHeaderSticky fields={props.fields} data={props.usersWithDetails} />
    </div>
  );

  function buildStyles() {
    return {
      container: {
        height: '100%',
      },
    };
  }
}
