import React from 'react';
import { MainHeader, Text } from '../../../components';
import { customThemeType, heights, useCustomTheme } from '../../../styles';
import { wordings } from '../../../wordings';
import { TreatmentsDataFetcher } from './TreatmentsDataFetcher';
import { TreatmentTable } from './TreatmentTable';

export { Treatments };

function Treatments() {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <>
      <div style={styles.header}>
        <MainHeader title={wordings.treatmentsPage.title} subtitle={wordings.treatmentsPage.subtitle} />
      </div>
      <TreatmentsDataFetcher>
        {({ treatments }) => (
          <div style={styles.table}>
            <div style={styles.tableHeaderContainer}>
              <div style={styles.tableHeader}>
                <Text>{wordings.treatmentsPage.table.filter.title}</Text>
              </div>
            </div>

            <div style={styles.tableContentContainer}>
              <TreatmentTable treatments={treatments} />
            </div>
          </div>
        )}
      </TreatmentsDataFetcher>
    </>
  );

  function buildStyles(theme: customThemeType) {
    return {
      header: {
        height: heights.header,
      },
      tableHeaderContainer: {
        height: heights.adminTreatmentsTableHeader,
      },
      tableHeader: {
        paddingTop: theme.spacing * 3,
      },
      tableContentContainer: {
        height: heights.adminTreatmentsTable,
        overflowY: 'auto',
      },
      table: {
        height: heights.adminPanel,
        paddingLeft: theme.spacing * 3,
        paddingRight: theme.spacing * 2,
      },
    } as const;
  }
}
