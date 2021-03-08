import React from 'react';
import { useHistory } from 'react-router-dom';
import { apiRouteOutType } from '@label/core';
import { PaginatedTable, tableRowFieldType } from '../../../components';
import { wordings } from '../../../wordings';

export { TreatmentTable };

function TreatmentTable(props: {
  fields: Array<tableRowFieldType<apiRouteOutType<'get', 'treatmentsWithDetails'>[number], string | number>>;
  treatmentsWithDetails: apiRouteOutType<'get', 'treatmentsWithDetails'>;
}) {
  const history = useHistory();
  const styles = buildStyles();

  const optionItems = buildOptionItems();
  return (
    <div style={styles.container}>
      <PaginatedTable
        isHeaderSticky
        defaultOrderByProperty="date"
        defaultOrderDirection="desc"
        fields={props.fields}
        data={props.treatmentsWithDetails}
        header={props.fields.map(({ id, title, canBeSorted }) => ({
          id,
          canBeSorted,
          text: title,
        }))}
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
        text: wordings.treatmentsPage.table.optionItems.openDocument,
        onClick: (treatmentWithDetails: apiRouteOutType<'get', 'treatmentsWithDetails'>[number]) => {
          history.push(`/admin/document/${treatmentWithDetails.treatment.documentId}`);
          return;
        },
      },
    ];
  }
}
