import React, { useState } from 'react';
import { flatten, uniq } from 'lodash';
import { apiRouteOutType, idModule, keysOf, treatmentInfoType, timeOperator, documentType } from '@label/core';
import {
  DocumentNumberTextInput,
  DocumentReviewStatusIcon,
  PublicationCategoryBadge,
  RefreshButton,
  tableRowFieldType,
} from '../../../components';
import {
  localStorage,
  treatedDocumentOrderByProperties,
  treatedDocumentFilterType,
} from '../../../services/localStorage';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { ExportCSVButton } from './ExportCSVButton';
import { TreatedDocumentsFilters } from './TreatedDocumentsFilters';
import { TreatedDocumentsTable } from './TreatedDocumentsTable';

export { TreatedDocuments };

const TABLE_ICON_SIZE = 28;

function TreatedDocuments(props: {
  treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>;
  refetch: () => void;
  isLoading: boolean;
}) {
  const theme = useCustomTheme();
  const INITIAL_FILTER_VALUES = localStorage.treatedDocumentsStateHandler.getFilters();
  const INITIAL_SEARCHED_DOCUMENT_NUMBER = localStorage.treatedDocumentsStateHandler.getSearchedDocumentNumber();
  const [filterValues, setFilterValues] = useState<treatedDocumentFilterType>(INITIAL_FILTER_VALUES);
  const [searchedDecisionNumber, setSearchedDocumentNumber] = useState<number | undefined>(
    INITIAL_SEARCHED_DOCUMENT_NUMBER,
  );
  const styles = buildStyles(theme);

  const filterInfo = extractFilterInfoFromTreatedDocuments(props.treatedDocuments);
  const treatmentsInfo = extractTreatmentsInfo(props.treatedDocuments);
  const treatmentFields = buildTreatedDocumentsFields(treatmentsInfo);
  const filteredTreatedDocuments = searchedDecisionNumber
    ? filterSearchedDocuments(props.treatedDocuments, searchedDecisionNumber)
    : getFilteredTreatedDocuments(props.treatedDocuments, treatmentsInfo, filterValues);

  return (
    <div style={styles.table}>
      <div style={styles.tableHeaderContainer}>
        <div style={styles.tableHeader}>
          <div style={styles.headerContent}>
            <TreatedDocumentsFilters
              filterInfo={filterInfo}
              filterValues={filterValues}
              setFilterValues={setAndStoreFilterValues}
              resultsCount={filteredTreatedDocuments.length}
            />
            <div style={styles.tableRightHeader}>
              <div style={styles.searchTextInputContainer}>
                <DocumentNumberTextInput value={searchedDecisionNumber} onChange={setAndStoreSearchedDocumentNumber} />
              </div>
              <RefreshButton onClick={props.refetch} isLoading={props.isLoading} />
            </div>
          </div>
        </div>
      </div>
      <div style={styles.tableContentContainer}>
        <TreatedDocumentsTable
          refetch={props.refetch}
          treatedDocuments={filteredTreatedDocuments}
          fields={treatmentFields}
        />
      </div>
      <div style={styles.csvButtonContainer}>
        <ExportCSVButton data={filteredTreatedDocuments} fields={treatmentFields} />
      </div>
    </div>
  );

  function setAndStoreFilterValues(filterValues: treatedDocumentFilterType) {
    localStorage.treatedDocumentsStateHandler.setFilters(filterValues);
    setFilterValues(filterValues);
  }

  function setAndStoreSearchedDocumentNumber(searchedDocumentNumber: number | undefined) {
    localStorage.treatedDocumentsStateHandler.setSearchedDocumentNumber(searchedDocumentNumber);
    setSearchedDocumentNumber(searchedDocumentNumber);
  }

  function extractTreatmentsInfo(treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>) {
    return treatedDocuments.reduce(
      (accumulator, treatedDocument) => ({
        ...accumulator,
        [idModule.lib.convertToString(treatedDocument.document._id)]: treatedDocument.statistic,
      }),
      {} as Record<string, treatmentInfoType>,
    );
  }

  function getFilteredTreatedDocuments(
    treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>,
    treatmentsInfo: Record<string, treatmentInfoType>,
    filterValues: treatedDocumentFilterType,
  ) {
    return treatedDocuments.filter((treatedDocument) => {
      return keysOf(filterValues).reduce((accumulator, currentFilterKey) => {
        if (currentFilterKey === 'mustHaveSurAnnotations' && !!filterValues[currentFilterKey]) {
          const treatmentInfo = treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)];
          return accumulator && treatmentInfo.surAnnotationsCount > 0;
        }
        if (currentFilterKey === 'mustHaveSubAnnotations' && !!filterValues[currentFilterKey]) {
          const treatmentInfo = treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)];
          return accumulator && treatmentInfo.subAnnotationsSensitiveCount > 0;
        }
        if (currentFilterKey === 'jurisdiction' && !!filterValues[currentFilterKey]) {
          return accumulator && treatedDocument.document.jurisdiction === filterValues.jurisdiction;
        }
        if (currentFilterKey === 'startDate' && !!filterValues.startDate) {
          return accumulator && treatedDocument.lastTreatmentDate >= filterValues.startDate.getTime();
        }
        if (currentFilterKey === 'endDate' && !!filterValues.endDate) {
          return accumulator && treatedDocument.lastTreatmentDate <= filterValues.endDate.getTime();
        }
        if (currentFilterKey === 'userName' && !!filterValues.userName) {
          return accumulator && treatedDocument.userNames.includes(filterValues.userName);
        }
        if (currentFilterKey === 'documentReviewFilterStatus' && !!filterValues.documentReviewFilterStatus) {
          return (
            accumulator &&
            convertDocumentReviewStatusToFilter(treatedDocument.document.reviewStatus) ===
              filterValues.documentReviewFilterStatus
          );
        }
        if (currentFilterKey === 'source' && !!filterValues.source) {
          return accumulator && treatedDocument.document.source === filterValues.source;
        }
        if (currentFilterKey === 'publicationCategoryLetter' && !!filterValues.publicationCategoryLetter) {
          return (
            accumulator && treatedDocument.document.publicationCategory.includes(filterValues.publicationCategoryLetter)
          );
        }
        return accumulator;
      }, true as boolean);
    });
  }

  function extractFilterInfoFromTreatedDocuments(treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>) {
    const jurisdictions = uniq(treatedDocuments.map((treatedDocument) => treatedDocument.document.jurisdiction));
    const publicationCategoryLetters = uniq(
      flatten(treatedDocuments.map((treatedDocument) => treatedDocument.document.publicationCategory)),
    );
    const sources = uniq(treatedDocuments.map((treatedDocument) => treatedDocument.document.source));
    const userNames = uniq(flatten(treatedDocuments.map((treatedDocument) => treatedDocument.userNames)));
    return { jurisdictions, publicationCategoryLetters, userNames, sources };
  }

  function buildTreatedDocumentsFields(treatmentsInfo: Record<string, treatmentInfoType>) {
    const treatedDocumentsFields: Array<tableRowFieldType<
      apiRouteOutType<'get', 'treatedDocuments'>[number],
      typeof treatedDocumentOrderByProperties[number]
    >> = [
      {
        id: 'documentNumber',
        title: wordings.treatedDocumentsPage.table.columnTitles.number.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.number.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.documentNumber,
        width: 2,
      },
      {
        id: 'occultationBlock',
        title: wordings.treatedDocumentsPage.table.columnTitles.occultationBlock.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.occultationBlock.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.occultationBlock || '',
        getSortingValue: (treatedDocument) => treatedDocument.document.occultationBlock || 0,
        width: 1,
      },
      {
        id: 'jurisdiction',
        title: wordings.treatedDocumentsPage.table.columnTitles.jurisdiction.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.jurisdiction.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.jurisdiction || '',
        width: 4,
      },
      {
        id: 'publicationCategory',
        title: wordings.treatedDocumentsPage.table.columnTitles.publicationCategory.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.publicationCategory.tooltipText,
        canBeSorted: true,
        getSortingValue: (treatedDocument) => treatedDocument.document.publicationCategory.length,
        extractor: (treatedDocument) => treatedDocument.document.publicationCategory.join(','),
        render: (treatedDocument) => (
          <div style={styles.publicationCategoryBadgesContainer}>
            {treatedDocument.document.publicationCategory.map((publicationCategoryLetter) => (
              <div style={styles.publicationCategoryBadgeContainer}>
                <PublicationCategoryBadge publicationCategoryLetter={publicationCategoryLetter} />
              </div>
            ))}
          </div>
        ),
        width: 2,
      },
      {
        id: 'session',
        title: wordings.treatedDocumentsPage.table.columnTitles.session.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.session.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.session,
        width: 2,
      },
      {
        id: 'source',
        title: wordings.treatedDocumentsPage.table.columnTitles.source.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.source.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.source,
        width: 2,
      },
      {
        id: 'userName',
        title: wordings.treatedDocumentsPage.table.columnTitles.workingUser.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.workingUser.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.userNames.join(', '),
        width: 8,
      },
      {
        id: 'reviewStatus',
        title: wordings.treatedDocumentsPage.table.columnTitles.reviewStatus.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.reviewStatus.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => convertDocumentReviewStatusToFilter(treatedDocument.document.reviewStatus),
        render: (treatedDocument) =>
          convertDocumentReviewStatusToFilter(treatedDocument.document.reviewStatus) === 'none' ? undefined : (
            <DocumentReviewStatusIcon iconSize={TABLE_ICON_SIZE} reviewStatus={treatedDocument.document.reviewStatus} />
          ),
        width: 2,
      },
      {
        id: 'date',
        title: wordings.treatedDocumentsPage.table.columnTitles.date,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          timeOperator.convertTimestampToReadableDate(treatedDocument.lastTreatmentDate, true),
        getSortingValue: (treatedDocument) => treatedDocument.lastTreatmentDate,
        width: 3,
      },
      {
        id: 'surAnnotationsCount',
        title: wordings.treatedDocumentsPage.table.columnTitles.surAnnotationsCount.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.surAnnotationsCount.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].surAnnotationsCount,
        width: 1,
      },
      {
        id: 'subAnnotationsSensitiveCount',
        title: wordings.treatedDocumentsPage.table.columnTitles.subAnnotationsSensitiveCount.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.subAnnotationsSensitiveCount.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].subAnnotationsSensitiveCount,
        width: 1,
      },
      {
        id: 'subAnnotationsNonSensitiveCount',
        title: wordings.treatedDocumentsPage.table.columnTitles.subAnnotationsNonSensitiveCount.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.subAnnotationsNonSensitiveCount.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].subAnnotationsNonSensitiveCount,
        width: 1,
      },
      {
        id: 'duration',
        canBeSorted: true,
        title: wordings.treatedDocumentsPage.table.columnTitles.duration.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.duration.tooltipText,
        extractor: (treatedDocument) =>
          timeOperator.convertDurationToReadableDuration(treatedDocument.totalTreatmentDuration),
        getSortingValue: (treatedDocument) => treatedDocument.totalTreatmentDuration,
        width: 1,
      },
    ];
    return treatedDocumentsFields;
  }

  function filterSearchedDocuments(
    treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>,
    searchedDecisionNumber: number,
  ) {
    return treatedDocuments.filter((treatedDocument) =>
      treatedDocument.document.documentNumber.toString().includes(searchedDecisionNumber.toString()),
    );
  }
}

function convertDocumentReviewStatusToFilter(documentReviewStatus: documentType['reviewStatus']) {
  if (documentReviewStatus.hasBeenAmended) {
    return 'amended';
  }
  if (documentReviewStatus.viewerNames.length > 0) {
    return 'viewed';
  }
  return 'none';
}

function buildStyles(theme: customThemeType) {
  return {
    header: {
      height: heights.header,
    },
    csvButtonContainer: {
      position: 'fixed',
      bottom: theme.spacing,
      right: theme.spacing * 2,
    },
    contentContainer: {
      display: 'flex',
      width: '100vw',
      height: heights.adminPanel,
    },
    headerContent: {
      flex: 1,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: theme.spacing * 2,
    },
    tableHeaderContainer: {
      height: heights.adminTreatmentsTableHeader,
    },
    publicationCategoryBadgesContainer: {
      display: 'flex',
    },
    publicationCategoryBadgeContainer: {
      marginRight: theme.spacing,
    },
    tableHeader: {
      paddingTop: theme.spacing * 2,
      display: 'flex',
      justifyContent: 'space-between',
    },
    tableRightHeader: {
      display: 'flex',
    },
    searchTextInputContainer: {
      marginRight: theme.spacing * 2,
    },
    tableContentContainer: {
      height: heights.adminTreatmentsTable,
      overflowY: 'auto',
    },
    table: {
      width: widths.adminContent,
      paddingLeft: theme.spacing * 3,
      paddingRight: theme.spacing * 2,
    },
  } as const;
}
