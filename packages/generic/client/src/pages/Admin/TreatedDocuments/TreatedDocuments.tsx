import React, { useState } from 'react';
import { flatten, uniq } from 'lodash';
import { apiRouteOutType, keysOf, timeOperator, documentType, userType } from '@label/core';
import {
  DocumentReviewStatusIcon,
  DocumentsTableHeader,
  PublicationCategoryBadge,
  tableRowFieldType,
} from '../../../components';
import {
  localStorage,
  treatedDocumentOrderByProperties,
  treatedDocumentFilterType,
} from '../../../services/localStorage';
import {
  filtersType,
  documentReviewFilterStatuses,
  convertDocumentReviewStatusToFilter,
} from '../../../services/filters';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
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
  const [searchedDocumentNumber, setSearchedDocumentNumber] = useState<number | undefined>(
    INITIAL_SEARCHED_DOCUMENT_NUMBER,
  );
  const styles = buildStyles(theme);

  const filterInfo = extractFilterInfoFromTreatedDocuments(props.treatedDocuments);
  const treatmentFields = buildTreatedDocumentsFields();
  const filteredTreatedDocuments = searchedDocumentNumber
    ? filterSearchedDocuments(props.treatedDocuments, searchedDocumentNumber)
    : getFilteredTreatedDocuments(props.treatedDocuments, filterValues);

  const filters = buildFilters();

  return (
    <div style={styles.table}>
      <DocumentsTableHeader
        filters={filters}
        resultsCount={filteredTreatedDocuments.length}
        searchedDocumentNumber={searchedDocumentNumber}
        setSearchedDocumentNumber={setAndStoreSearchedDocumentNumber}
        refetch={props.refetch}
        isLoading={props.isLoading}
      />
      <div style={styles.tableContentContainer}>
        <TreatedDocumentsTable
          refetch={props.refetch}
          treatedDocuments={filteredTreatedDocuments}
          fields={treatmentFields}
        />
      </div>
    </div>
  );

  function buildFilters(): Partial<filtersType> {
    return {
      source: {
        value: filterValues.source,
        possibleValues: filterInfo.sources,
        setValue: (source: documentType['source'] | undefined) => setAndStoreFilterValues({ ...filterValues, source }),
      },
      userName: {
        value: filterValues.userName,
        possibleValues: filterInfo.userNames,
        setValue: (userName: userType['name'] | undefined) => setAndStoreFilterValues({ ...filterValues, userName }),
      },
      publicationCategoryLetter: {
        value: filterValues.publicationCategoryLetter,
        possibleValues: filterInfo.publicationCategoryLetters,
        setValue: (publicationCategoryLetter: documentType['publicationCategory'][number] | undefined) =>
          setAndStoreFilterValues({ ...filterValues, publicationCategoryLetter }),
      },
      route: {
        value: filterValues.route,
        setValue: (route: documentType['route'] | undefined) => setAndStoreFilterValues({ ...filterValues, route }),
      },
      jurisdiction: {
        value: filterValues.jurisdiction,
        possibleValues: filterInfo.jurisdictions,
        setValue: (jurisdiction: documentType['decisionMetadata']['jurisdiction'] | undefined) =>
          setAndStoreFilterValues({ ...filterValues, jurisdiction }),
      },
      treatmentDate: {
        value: { startDate: filterValues.startDate, endDate: filterValues.endDate },
        extremumValues: { min: filterInfo.minDate, max: filterInfo.maxDate },
        setValue: ({ startDate, endDate }: { startDate: Date | undefined; endDate: Date | undefined }) =>
          setAndStoreFilterValues({ ...filterValues, startDate, endDate }),
      },
      documentReviewFilterStatus: {
        value: filterValues.documentReviewFilterStatus,
        setValue: (documentReviewFilterStatus: typeof documentReviewFilterStatuses[number] | undefined) =>
          setAndStoreFilterValues({ ...filterValues, documentReviewFilterStatus }),
      },
      mustHaveSubAnnotations: {
        value: filterValues.mustHaveSubAnnotations,
        setValue: (mustHaveSubAnnotations: boolean | undefined) =>
          setAndStoreFilterValues({ ...filterValues, mustHaveSubAnnotations: !!mustHaveSubAnnotations }),
      },
      mustHaveSurAnnotations: {
        value: filterValues.mustHaveSurAnnotations,
        setValue: (mustHaveSurAnnotations: boolean | undefined) =>
          setAndStoreFilterValues({ ...filterValues, mustHaveSurAnnotations: !!mustHaveSurAnnotations }),
      },
    };
  }

  function setAndStoreFilterValues(filterValues: treatedDocumentFilterType) {
    localStorage.treatedDocumentsStateHandler.setFilters(filterValues);
    setFilterValues(filterValues);
  }

  function setAndStoreSearchedDocumentNumber(searchedDocumentNumber: number | undefined) {
    localStorage.treatedDocumentsStateHandler.setSearchedDocumentNumber(searchedDocumentNumber);
    setSearchedDocumentNumber(searchedDocumentNumber);
  }

  function getFilteredTreatedDocuments(
    treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>,
    filterValues: treatedDocumentFilterType,
  ) {
    return treatedDocuments.filter((treatedDocument) => {
      return keysOf(filterValues).reduce((accumulator, currentFilterKey) => {
        if (currentFilterKey === 'mustHaveSurAnnotations' && !!filterValues[currentFilterKey]) {
          return (
            accumulator &&
            treatedDocument.statistic.surAnnotationsCount !== undefined &&
            treatedDocument.statistic.surAnnotationsCount > 0
          );
        }
        if (currentFilterKey === 'mustHaveSubAnnotations' && !!filterValues[currentFilterKey]) {
          return (
            accumulator &&
            treatedDocument.statistic.subAnnotationsSensitiveCount !== undefined &&
            treatedDocument.statistic.subAnnotationsSensitiveCount > 0
          );
        }
        if (currentFilterKey === 'jurisdiction' && !!filterValues[currentFilterKey]) {
          return accumulator && treatedDocument.document.jurisdiction === filterValues.jurisdiction;
        }
        if (currentFilterKey === 'startDate' && !!filterValues.startDate) {
          return (
            accumulator &&
            treatedDocument.lastTreatmentDate !== undefined &&
            treatedDocument.lastTreatmentDate >= filterValues.startDate.getTime()
          );
        }
        if (currentFilterKey === 'endDate' && !!filterValues.endDate) {
          return (
            accumulator &&
            treatedDocument.lastTreatmentDate !== undefined &&
            treatedDocument.lastTreatmentDate <= filterValues.endDate.getTime()
          );
        }
        if (currentFilterKey === 'userName' && !!filterValues.userName) {
          return accumulator && treatedDocument.userNames.includes(filterValues.userName);
        }
        if (currentFilterKey === 'route' && !!filterValues.route) {
          return accumulator && treatedDocument.document.route === filterValues.route;
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
    const maxDate =
      treatedDocuments.length > 0
        ? Math.max(
            ...treatedDocuments
              .filter(({ lastTreatmentDate }) => lastTreatmentDate !== undefined)
              .map((treatedDocument) => treatedDocument.lastTreatmentDate as number),
          )
        : undefined;
    const minDate =
      treatedDocuments.length > 0
        ? Math.min(
            ...treatedDocuments
              .filter(({ lastTreatmentDate }) => lastTreatmentDate !== undefined)
              .map((treatedDocument) => treatedDocument.lastTreatmentDate as number),
          )
        : undefined;
    return { jurisdictions, publicationCategoryLetters, userNames, sources, maxDate, minDate };
  }

  function buildTreatedDocumentsFields() {
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
        extractor: (treatedDocument) => treatedDocument.document.occultationBlock || '-',
        getSortingValue: (treatedDocument) => treatedDocument.document.occultationBlock || 0,
        width: 1,
      },
      {
        id: 'jurisdiction',
        title: wordings.treatedDocumentsPage.table.columnTitles.jurisdiction.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.jurisdiction.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.jurisdiction || '-',
        width: 4,
      },
      {
        id: 'publicationCategory',
        title: wordings.treatedDocumentsPage.table.columnTitles.publicationCategory.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.publicationCategory.tooltipText,
        canBeSorted: true,
        getSortingValue: (treatedDocument) => treatedDocument.document.publicationCategory.length,
        extractor: (treatedDocument) => treatedDocument.document.publicationCategory.join(','),
        render: (treatedDocument) =>
          treatedDocument.document.publicationCategory.length > 0 ? (
            <div style={styles.publicationCategoryBadgesContainer}>
              {treatedDocument.document.publicationCategory.map((publicationCategoryLetter) => (
                <div style={styles.publicationCategoryBadgeContainer}>
                  <PublicationCategoryBadge publicationCategoryLetter={publicationCategoryLetter} />
                </div>
              ))}
            </div>
          ) : (
            '-'
          ),
        width: 2,
      },
      {
        id: 'source',
        title: wordings.treatedDocumentsPage.table.columnTitles.source.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.source.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.source,
        width: 1,
      },
      {
        id: 'userName',
        title: wordings.treatedDocumentsPage.table.columnTitles.workingUser.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.workingUser.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.userNames.join(', '),
        width: 6,
      },
      {
        id: 'reviewStatus',
        title: wordings.treatedDocumentsPage.table.columnTitles.reviewStatus.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.reviewStatus.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => convertDocumentReviewStatusToFilter(treatedDocument.document.reviewStatus),
        render: (treatedDocument) =>
          convertDocumentReviewStatusToFilter(treatedDocument.document.reviewStatus) === 'none' ? (
            '-'
          ) : (
            <DocumentReviewStatusIcon iconSize={TABLE_ICON_SIZE} reviewStatus={treatedDocument.document.reviewStatus} />
          ),
        width: 1,
      },
      {
        id: 'route',
        title: wordings.treatedDocumentsPage.table.columnTitles.route.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.route.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => wordings.business.documentRoute[treatedDocument.document.route],
        width: 2,
      },
      {
        id: 'date',
        title: wordings.treatedDocumentsPage.table.columnTitles.date,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatedDocument.lastTreatmentDate !== undefined
            ? timeOperator.convertTimestampToReadableDate(treatedDocument.lastTreatmentDate, true)
            : '-',
        getSortingValue: (treatedDocument) => treatedDocument.lastTreatmentDate || 0,
        width: 3,
      },
      {
        id: 'surAnnotationsCount',
        title: wordings.treatedDocumentsPage.table.columnTitles.surAnnotationsCount.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.surAnnotationsCount.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatedDocument.statistic.surAnnotationsCount !== undefined
            ? treatedDocument.statistic.surAnnotationsCount
            : '-',
        width: 1,
      },
      {
        id: 'subAnnotationsSensitiveCount',
        title: wordings.treatedDocumentsPage.table.columnTitles.subAnnotationsSensitiveCount.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.subAnnotationsSensitiveCount.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatedDocument.statistic.subAnnotationsSensitiveCount !== undefined
            ? treatedDocument.statistic.subAnnotationsSensitiveCount
            : '-',
        width: 1,
      },
      {
        id: 'subAnnotationsNonSensitiveCount',
        title: wordings.treatedDocumentsPage.table.columnTitles.subAnnotationsNonSensitiveCount.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.subAnnotationsNonSensitiveCount.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatedDocument.statistic.subAnnotationsNonSensitiveCount !== undefined
            ? treatedDocument.statistic.subAnnotationsNonSensitiveCount
            : '-',
        width: 1,
      },
      {
        id: 'duration',
        canBeSorted: true,
        title: wordings.treatedDocumentsPage.table.columnTitles.duration.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.duration.tooltipText,
        extractor: (treatedDocument) =>
          treatedDocument.totalTreatmentDuration !== undefined
            ? timeOperator.convertDurationToReadableDuration(treatedDocument.totalTreatmentDuration)
            : '-',
        getSortingValue: (treatedDocument) => treatedDocument.totalTreatmentDuration || 0,
        width: 1,
      },
    ];
    return treatedDocumentsFields;
  }

  function filterSearchedDocuments(
    treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>,
    searchedDocumentNumber: number,
  ) {
    return treatedDocuments.filter((treatedDocument) =>
      treatedDocument.document.documentNumber.toString().includes(searchedDocumentNumber.toString()),
    );
  }
}

function buildStyles(theme: customThemeType) {
  return {
    header: {
      height: heights.header,
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
