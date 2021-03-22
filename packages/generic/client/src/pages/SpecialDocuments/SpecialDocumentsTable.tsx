import React from 'react';
import { apiRouteOutType } from '@label/core';
import { PaginatedTable, tableRowFieldType } from '../../components';

export { SpecialDocumentsTable };

function SpecialDocumentsTable(props: {
  fields: Array<tableRowFieldType<apiRouteOutType<'get', 'specialDocuments'>[number]>>;
  specialDocuments: apiRouteOutType<'get', 'specialDocuments'>;
}) {
  const styles = buildStyles();

  return (
    <div style={styles.container}>
      <PaginatedTable isHeaderSticky fields={props.fields} data={props.specialDocuments} />
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
