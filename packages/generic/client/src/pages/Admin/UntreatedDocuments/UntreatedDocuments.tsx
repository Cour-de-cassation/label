import { apiRouteOutType, idModule } from '@label/core';
import React from 'react';
import { AdminMenu, MainHeader, tableRowFieldType } from '../../../components';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { UntreatedDocumentsDataFetcher } from './UntreatedDocumentsDataFetcher';
import { UntreatedDocumentsTable } from './UntreatedDocumentsTable';

export { UntreatedDocuments };

function UntreatedDocuments() {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <>
      <div style={styles.header}>
        <MainHeader title={wordings.untreatedDocumentsPage.title} subtitle={wordings.treatmentsPage.subtitle} />
      </div>
      <div style={styles.contentContainer}>
        <AdminMenu />
        <UntreatedDocumentsDataFetcher>
          {({ untreatedDocuments }) => {
            const untreatedDocumentsFields = buildUntreatedDocumentsFields();
            return (
              <div style={styles.table}>
                <div style={styles.tableHeaderContainer}>
                  <div style={styles.tableHeader}></div>
                </div>
                <div style={styles.tableContentContainer}>
                  <UntreatedDocumentsTable fields={untreatedDocumentsFields} untreatedDocuments={untreatedDocuments} />
                </div>
              </div>
            );
          }}
        </UntreatedDocumentsDataFetcher>
      </div>
    </>
  );

  function buildUntreatedDocumentsFields() {
    const untreatedDocumentsFields: Array<tableRowFieldType<
      apiRouteOutType<'get', 'untreatedDocuments'>[number],
      string | number
    >> = [
      {
        id: 'documentId',
        title: wordings.untreatedDocumentsPage.table.columnTitles.number,
        canBeSorted: true,
        extractor: (untreatedDocument) => idModule.lib.convertToString(untreatedDocument._id),
        width: 10,
      },
    ];
    return untreatedDocumentsFields;
  }

  function buildStyles(theme: customThemeType) {
    return {
      header: {
        height: heights.header,
      },
      contentContainer: {
        width: '100vw',
        display: 'flex',
      },
      tableHeaderContainer: {
        height: heights.adminTreatmentsTableHeader,
      },
      tableHeader: {
        paddingTop: theme.spacing * 2,
        display: 'flex',
        justifyContent: 'space-between',
      },
      tableContentContainer: {
        height: heights.adminTreatmentsTable,
        overflowY: 'auto',
      },
      table: {
        height: heights.adminPanel,
        width: widths.adminContent,
        paddingLeft: theme.spacing * 3,
        paddingRight: theme.spacing * 2,
      },
    } as const;
  }
}
