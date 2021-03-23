import React from 'react';
import { useHistory } from 'react-router';
import { apiRouteOutType } from '@label/core';
import { PaginatedTable, tableRowFieldType } from '../../components';
import { wordings } from '../../wordings';

export { SpecialDocumentsTable };

function SpecialDocumentsTable(props: {
  fields: Array<tableRowFieldType<apiRouteOutType<'get', 'specialDocuments'>[number]>>;
  specialDocuments: apiRouteOutType<'get', 'specialDocuments'>;
}) {
  const history = useHistory();
  const styles = buildStyles();
  const optionItems = buildOptionItems();
  return (
    <div style={styles.container}>
      <PaginatedTable isHeaderSticky fields={props.fields} data={props.specialDocuments} optionItems={optionItems} />
    </div>
  );

  function buildOptionItems() {
    return [
      {
        text: wordings.specialDocumentsPage.table.optionItems.openAnonymizedDocument,
        onClick: (specialDocument: apiRouteOutType<'get', 'specialDocuments'>[number]) => {
          history.push(`/anonymized-document/${specialDocument._id}`);
          return;
        },
      },
    ];
  }
}

function buildStyles() {
  return {
    container: {
      height: '100%',
    },
  };
}
