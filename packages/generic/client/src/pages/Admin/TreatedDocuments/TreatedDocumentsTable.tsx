import React from 'react';
import { useHistory } from 'react-router-dom';
import { apiRouteOutType } from '@label/core';
import { PaginatedTable, tableRowFieldType } from '../../../components';
import { wordings } from '../../../wordings';

export { TreatedDocumentsTable };

function TreatedDocumentsTable(props: {
  fields: Array<tableRowFieldType<apiRouteOutType<'get', 'treatedDocuments'>[number]>>;
  treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>;
}) {
  const history = useHistory();
  const styles = buildStyles();

  const optionItems = buildOptionItems();
  return (
    <div style={styles.container}>
      <PaginatedTable
        defaultOrderByProperty="date"
        defaultOrderDirection="desc"
        fields={props.fields}
        data={props.treatedDocuments}
        optionItems={optionItems}
      />
    </div>
  );

  function buildStyles() {
    return {
      container: {
        height: '100%',
      },
    };
  }

  function buildOptionItems() {
    return [
      {
        text: wordings.treatedDocumentsPage.table.optionItems.openDocument,
        onClick: (treatmentWithDetails: apiRouteOutType<'get', 'treatedDocuments'>[number]) => {
          history.push(`/admin/document/${treatmentWithDetails.document._id}`);
          return;
        },
        iconName: 'eye',
      },
    ];
  }
}
