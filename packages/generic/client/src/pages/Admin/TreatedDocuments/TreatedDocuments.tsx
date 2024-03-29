import React, { useState } from 'react';
import { flatten, uniq } from 'lodash';
import { customThemeType, useCustomTheme, tableRowFieldType } from 'pelta-design-system';
import { apiRouteOutType, keysOf, timeOperator, documentType, userType } from '@label/core';
import { DocumentReviewStatusIcon, DocumentsTableHeader, PublicationCategoryBadge } from '../../../components';
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
import { heights, widths } from '../../../styles';
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
        possibleValues: filterInfo.userNames.sort(),
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
        value: { startDate: filterValues.treatmentStartDate, endDate: filterValues.treatmentEndDate },
        extremumValues: { min: filterInfo.minTreatmentDate, max: filterInfo.maxTreatmentDate },
        setValue: ({ startDate, endDate }: { startDate: Date | undefined; endDate: Date | undefined }) =>
          setAndStoreFilterValues({ ...filterValues, treatmentStartDate: startDate, treatmentEndDate: endDate }),
      },
      documentCreationDate: {
        value: { startDate: filterValues.documentCreationStartDate, endDate: filterValues.documentCreationEndDate },
        extremumValues: { min: filterInfo.minDocumentCreationDate, max: filterInfo.maxDocumentCreationDate },
        setValue: ({ startDate, endDate }: { startDate: Date | undefined; endDate: Date | undefined }) =>
          setAndStoreFilterValues({
            ...filterValues,
            documentCreationStartDate: startDate,
            documentCreationEndDate: endDate,
          }),
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
        if (currentFilterKey === 'treatmentStartDate' && !!filterValues.treatmentStartDate) {
          return (
            accumulator &&
            !!treatedDocument.lastTreatmentDate &&
            treatedDocument.lastTreatmentDate >= filterValues.treatmentStartDate.getTime()
          );
        }
        if (currentFilterKey === 'treatmentEndDate' && !!filterValues.treatmentEndDate) {
          return (
            accumulator &&
            !!treatedDocument.lastTreatmentDate &&
            treatedDocument.lastTreatmentDate <= filterValues.treatmentEndDate.getTime()
          );
        }
        if (currentFilterKey === 'documentCreationStartDate' && !!filterValues.documentCreationStartDate) {
          return (
            accumulator &&
            !!treatedDocument.document.creationDate &&
            treatedDocument.document.creationDate >= filterValues.documentCreationStartDate.getTime()
          );
        }
        if (currentFilterKey === 'documentCreationEndDate' && !!filterValues.documentCreationEndDate) {
          return (
            accumulator &&
            !!treatedDocument.document.creationDate &&
            treatedDocument.document.creationDate <= filterValues.documentCreationEndDate.getTime()
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
    const lastTreatmentDates = treatedDocuments
      .filter(({ lastTreatmentDate }) => !!lastTreatmentDate)
      .map((treatedDocument) => treatedDocument.lastTreatmentDate as number);
    const maxTreatmentDate = lastTreatmentDates.length > 0 ? Math.max(...lastTreatmentDates) : undefined;
    const minTreatmentDate = lastTreatmentDates.length > 0 ? Math.min(...lastTreatmentDates) : undefined;
    const creationDates = treatedDocuments
      .filter(({ document }) => !!document.creationDate)
      .map((treatedDocument) => treatedDocument.document.creationDate as number);
    const maxDocumentCreationDate = creationDates.length > 0 ? Math.max(...creationDates) : undefined;
    const minDocumentCreationDate = creationDates.length > 0 ? Math.min(...creationDates) : undefined;
    return {
      jurisdictions,
      publicationCategoryLetters,
      userNames,
      sources,
      maxTreatmentDate,
      minTreatmentDate,
      minDocumentCreationDate,
      maxDocumentCreationDate,
    };
  }

  function buildTreatedDocumentsFields() {
    const treatedDocumentsFields: Array<tableRowFieldType<
      apiRouteOutType<'get', 'treatedDocuments'>[number],
      typeof treatedDocumentOrderByProperties[number]
    >> = [
      {
        id: 'documentNumber',
        title: wordings.business.filters.columnTitles.documentNumber,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.documentNumber,
        width: 2,
      },
      {
        id: 'occultationBlock',
        title: wordings.business.filters.columnTitles.occultationBlock.title,
        tooltipText: wordings.business.filters.columnTitles.occultationBlock.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.occultationBlock || '-',
        getSortingValue: (treatedDocument) => treatedDocument.document.occultationBlock || 0,
        width: 1,
      },
      {
        id: 'jurisdiction',
        title: wordings.business.filters.columnTitles.jurisdiction.title,
        tooltipText: wordings.business.filters.columnTitles.jurisdiction.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.jurisdiction || '-',
        width: 4,
      },
      {
        id: 'publicationCategory',
        title: wordings.business.filters.columnTitles.publicationCategory.title,
        tooltipText: wordings.business.filters.columnTitles.publicationCategory.tooltipText,
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
        title: wordings.business.filters.columnTitles.source.title,
        tooltipText: wordings.business.filters.columnTitles.source.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.source,
        width: 1,
      },
      {
        id: 'userName',
        title: wordings.business.filters.columnTitles.workingUser.title,
        tooltipText: wordings.business.filters.columnTitles.workingUser.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.userNames.join(', '),
        width: 6,
      },
      {
        id: 'reviewStatus',
        title: wordings.business.filters.columnTitles.reviewStatus.title,
        tooltipText: wordings.business.filters.columnTitles.reviewStatus.tooltipText,
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
        title: wordings.business.filters.columnTitles.route.title,
        tooltipText: wordings.business.filters.columnTitles.route.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => wordings.business.documentRoute[treatedDocument.document.route],
        width: 2,
      },
      {
        id: 'lastTreatmentDate',
        title: wordings.business.filters.columnTitles.treatmentDate,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatedDocument.lastTreatmentDate !== undefined
            ? timeOperator.convertTimestampToReadableDate(treatedDocument.lastTreatmentDate, true)
            : '-',
        getSortingValue: (treatedDocument) => treatedDocument.lastTreatmentDate || 0,
        width: 3,
      },
      {
        id: 'creationDate',
        title: wordings.business.filters.columnTitles.creationDate.title,
        tooltipText: wordings.business.filters.columnTitles.creationDate.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          !!treatedDocument.document.creationDate
            ? timeOperator.convertTimestampToReadableDate(treatedDocument.document.creationDate)
            : '-',
        getSortingValue: (treatedDocument) => treatedDocument.document.creationDate || 0,
        width: 2,
      },
      {
        id: 'loss',
        title: wordings.business.filters.columnTitles.loss.title,
        tooltipText: wordings.business.filters.columnTitles.loss.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatedDocument.document.loss !== undefined ? treatedDocument.document.loss : '-',
        getSortingValue: (treatedDocument) => treatedDocument.document.creationDate || 0,
        width: 1,
      },
      {
        id: 'surAnnotationsCount',
        title: wordings.business.filters.columnTitles.surAnnotationsCount.title,
        tooltipText: wordings.business.filters.columnTitles.surAnnotationsCount.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatedDocument.statistic.surAnnotationsCount !== undefined
            ? treatedDocument.statistic.surAnnotationsCount
            : '-',
        width: 1,
      },
      {
        id: 'subAnnotationsSensitiveCount',
        title: wordings.business.filters.columnTitles.subAnnotationsSensitiveCount.title,
        tooltipText: wordings.business.filters.columnTitles.subAnnotationsSensitiveCount.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatedDocument.statistic.subAnnotationsSensitiveCount !== undefined
            ? treatedDocument.statistic.subAnnotationsSensitiveCount
            : '-',
        width: 1,
      },
      {
        id: 'subAnnotationsNonSensitiveCount',
        title: wordings.business.filters.columnTitles.subAnnotationsNonSensitiveCount.title,
        tooltipText: wordings.business.filters.columnTitles.subAnnotationsNonSensitiveCount.tooltipText,
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
        title: wordings.business.filters.columnTitles.duration.title,
        tooltipText: wordings.business.filters.columnTitles.duration.tooltipText,
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
