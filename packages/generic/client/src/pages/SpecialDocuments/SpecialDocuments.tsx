import React from 'react';
import { MainHeader } from '../../components';
import { customThemeType, heights, useCustomTheme } from '../../styles';
import { wordings } from '../../wordings';
import { SpecialDocumentsDataFetcher } from './SpecialDocumentsDataFetcher';
import { SpecialDocumentsTable } from './SpecialDocumentsTable';

export { SpecialDocuments };

const TABLE_WIDTH = '300px';

function SpecialDocuments() {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <>
      <div style={styles.header}>
        <MainHeader title={wordings.specialDocumentsPage.title} />
      </div>
      <div style={styles.contentContainer}>
        <SpecialDocumentsDataFetcher>
          {({ specialDocuments }) => (
            <div style={styles.table}>
              <div style={styles.tableHeaderContainer}>
                <div style={styles.tableHeader}></div>
              </div>
              <div style={styles.tableContentContainer}>
                <SpecialDocumentsTable specialDocuments={specialDocuments} />
              </div>
            </div>
          )}
        </SpecialDocumentsDataFetcher>
      </div>
    </>
  );
}

function buildStyles(theme: customThemeType) {
  return {
    header: {
      height: heights.header,
    },
    contentContainer: {
      display: 'flex',
      width: TABLE_WIDTH,
      margin: '0 auto',
      height: heights.specialDocuments,
    },
    tableHeaderContainer: {
      height: heights.specialDocumentsTableHeader,
    },
    tableHeader: {
      paddingTop: theme.spacing * 4,
      display: 'flex',
      justifyContent: 'flex-end',
    },
    tableContentContainer: {
      height: heights.specialDocumentsTable,
      overflowY: 'auto',
    },
    table: {
      width: '100%',
      paddingLeft: theme.spacing * 3,
      paddingRight: theme.spacing * 2,
    },
  } as const;
}
