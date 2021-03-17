import React from 'react';
import { apiRouteOutType } from '@label/core';
import { PaginatedTable, tableRowFieldType } from '../../../components';

export { UntreatedDocumentsTable };

function UntreatedDocumentsTable(props: {
  fields: Array<tableRowFieldType<apiRouteOutType<'get', 'untreatedDocuments'>[number], string | number | JSX.Element>>;
  untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>;
}) {
  const styles = buildStyles();

  return (
    <div style={styles.container}>
      <PaginatedTable isHeaderSticky fields={props.fields} data={props.untreatedDocuments} />
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
