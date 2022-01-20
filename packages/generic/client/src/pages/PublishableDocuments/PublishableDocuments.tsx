import React from 'react';
import { customThemeType, useCustomTheme } from 'pelta-design-system';
import { MainHeader } from '../../components';
import { heights } from '../../styles';
import { wordings } from '../../wordings';
import { PublishableDocumentsDataFetcher } from './PublishableDocumentsDataFetcher';
import { PublishableDocumentsTable } from './PublishableDocumentsTable';

export { PublishableDocuments };

const TABLE_WIDTH = 800;

function PublishableDocuments() {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <>
      <div style={styles.header}>
        <MainHeader title={wordings.publishableDocumentsPage.title} />
      </div>
      <div style={styles.contentContainer}>
        <PublishableDocumentsDataFetcher>
          {({ publishableDocuments, refetch }) => (
            <div style={styles.table}>
              <div style={styles.tableHeaderContainer}>
                <div style={styles.tableHeader}></div>
              </div>
              <div style={styles.tableContentContainer}>
                <PublishableDocumentsTable refetch={refetch} publishableDocuments={publishableDocuments} />
              </div>
            </div>
          )}
        </PublishableDocumentsDataFetcher>
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
      width: `${TABLE_WIDTH}px`,
      margin: '0 auto',
      height: heights.publishableDocuments,
    },
    tableHeaderContainer: {
      height: heights.publishableDocumentsTableHeader,
    },
    tableHeader: {
      paddingTop: theme.spacing * 4,
      display: 'flex',
      justifyContent: 'flex-end',
    },
    tableContentContainer: {
      height: heights.publishableDocumentsTable,
      overflowY: 'auto',
    },
    table: {
      width: '100%',
      paddingLeft: theme.spacing * 3,
      paddingRight: theme.spacing * 2,
    },
  } as const;
}
