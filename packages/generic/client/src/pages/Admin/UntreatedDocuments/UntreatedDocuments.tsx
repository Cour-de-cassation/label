import React, { useState } from 'react';
import { apiRouteOutType, keysOf } from '@label/core';
import { AdminMenu, MainHeader, PublicationCategoryBadge, tableRowFieldType } from '../../../components';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { UntreatedDocumentsDataFetcher } from './UntreatedDocumentsDataFetcher';
import { UntreatedDocumentsTable } from './UntreatedDocumentsTable';
import { untreatedDocumentFilterType, UntreatedDocumentsFilters } from './UntreatedDocumentsFilters';

export { UntreatedDocuments };

const DEFAULT_FILTERS = {};

function UntreatedDocuments() {
  const [filterValues, setFilterValues] = useState<untreatedDocumentFilterType>(DEFAULT_FILTERS);
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
            const filterInfo = extractFilterInfoFromDocuments();
            const filteredUntreatedDocuments = getFilteredUntreatedDocuments(untreatedDocuments, filterValues);
            return (
              <div style={styles.table}>
                <div style={styles.tableHeaderContainer}>
                  <div style={styles.tableHeader}>
                    <UntreatedDocumentsFilters
                      filterInfo={filterInfo}
                      filterValues={filterValues}
                      setFilterValues={setFilterValues}
                      resultsCount={filteredUntreatedDocuments.length}
                    />
                  </div>
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

  function getFilteredUntreatedDocuments(
    untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>,
    filterValues: untreatedDocumentFilterType,
  ) {
    return untreatedDocuments.filter(() => {
      return keysOf(filterValues).reduce((accumulator) => {
        return accumulator;
      }, true as boolean);
    });
  }

  function extractFilterInfoFromDocuments() {
    return {};
  }

  function buildUntreatedDocumentsFields() {
    const untreatedDocumentsFields: Array<tableRowFieldType<
      apiRouteOutType<'get', 'untreatedDocuments'>[number],
      string | number | JSX.Element
    >> = [
      {
        id: 'documentId',
        title: wordings.untreatedDocumentsPage.table.columnTitles.number,
        canBeSorted: true,
        extractor: (untreatedDocument) => untreatedDocument.documentId,
        width: 10,
      },
      {
        id: 'publicationCategory',
        title: wordings.untreatedDocumentsPage.table.columnTitles.publicationCategory,
        canBeSorted: true,
        extractor: (untreatedDocument) => (
          <div style={styles.publicationCategoryBadgesContainer}>
            {untreatedDocument.publicationCategory.map((publicationCategoryLetter) => (
              <div style={styles.publicationCategoryBadgeContainer}>
                <PublicationCategoryBadge publicationCategoryLetter={publicationCategoryLetter} />
              </div>
            ))}
          </div>
        ),
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
      publicationCategoryBadgesContainer: {
        display: 'flex',
      },
      publicationCategoryBadgeContainer: {
        marginRight: theme.spacing,
      },
    } as const;
  }
}
