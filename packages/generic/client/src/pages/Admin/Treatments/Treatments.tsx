import React from 'react';
import { MainHeader } from '../../../components';
import { heights } from '../../../styles';
import { wordings } from '../../../wordings';
import { TreatmentsDataFetcher } from './TreatmentsDataFetcher';
import { TreatmentTable } from './TreatmentTable';

export { Treatments };

function Treatments() {
  const styles = buildStyles();
  return (
    <>
      <div style={styles.header}>
        <MainHeader title={wordings.treatmentsPage.title} subtitle={wordings.treatmentsPage.subtitle} />
      </div>
      <TreatmentsDataFetcher>
        {({ treatments }) => (
          <div style={styles.table}>
            <div style={styles.tableHeader}></div>

            <div style={styles.tableBody}>
              <TreatmentTable treatments={treatments} />
            </div>
            <div style={styles.tableFooter}></div>
          </div>
        )}
      </TreatmentsDataFetcher>
    </>
  );

  function buildStyles() {
    return {
      header: {
        height: heights.header,
      },
      tableHeader: {
        height: heights.adminTreatmentsTableHeader,
      },
      tableFooter: {
        height: heights.adminTreatmentsTableFooter,
      },
      tableBody: {
        height: heights.adminTreatmentsTable,
        overflowY: 'auto',
      },
      table: {
        height: heights.adminPanel,
      },
    } as const;
  }
}
