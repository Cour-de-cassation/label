import React from 'react';
import { ButtonWithIcon, MainHeader, Text } from '../../../components';
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
        {({ treatmentsWithDetails }) => (
          <div style={styles.table}>
            <div style={styles.tableHeaderContainer}>
              <div style={styles.tableHeader}>
                <div style={styles.filterContainer}>
                  <Text>{wordings.treatmentsPage.table.filter.title}</Text>
                </div>
                <ButtonWithIcon iconName="export" text={wordings.treatmentsPage.table.filter.exportButton} />
              </div>
            </div>

            <div style={styles.tableContentContainer}>
              <TreatmentTable treatmentsWithDetails={treatmentsWithDetails} />
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
      filterContainer: {
        paddingTop: theme.spacing,
      },
      tableHeaderContainer: {
        height: heights.adminTreatmentsTableHeader,
      },
      tableHeader: {
        paddingTop: theme.spacing * 2,
        paddingRight: theme.spacing,
        display: 'flex',
        justifyContent: 'space-between',
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
