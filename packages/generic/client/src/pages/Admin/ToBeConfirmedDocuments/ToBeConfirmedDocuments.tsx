import React, { useState } from 'react';
import { flatten, uniq } from 'lodash';
import { apiRouteOutType, userType, documentType, keysOf } from '@label/core';
import { DocumentsTableHeader } from '../../../components';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import {
  convertDocumentReviewStatusToFilter,
  documentReviewFilterStatuses,
  filtersType,
} from '../../../services/filters';
import { ToBeConfirmedDocumentsTable } from './ToBeConfirmedDocumentsTable';
import { localStorage, toBeConfirmedDocumentFilterType } from '../../../services/localStorage';

export { ToBeConfirmedDocuments };

function ToBeConfirmedDocuments(props: {
  toBeConfirmedDocuments: apiRouteOutType<'get', 'toBeConfirmedDocuments'>;
  users: Array<Pick<userType, '_id' | 'name'>>;
  refetch: () => void;
  isLoading: boolean;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const INITIAL_FILTER_VALUES = localStorage.toBeConfirmedDocumentsStateHandler.getFilters();
  const INITIAL_SEARCHED_DOCUMENT_NUMBER = localStorage.toBeConfirmedDocumentsStateHandler.getSearchedDocumentNumber();
  const [filterValues, setFilterValues] = useState<toBeConfirmedDocumentFilterType>(INITIAL_FILTER_VALUES);
  const [searchedDocumentNumber, setSearchedDocumentNumber] = useState<number | undefined>(
    INITIAL_SEARCHED_DOCUMENT_NUMBER,
  );
  const filterInfo = extractFilterInfoFromToBeConfirmedDocuments(props.toBeConfirmedDocuments);

  const filters = buildFilters();

  const filteredToBeConfirmedDocuments = searchedDocumentNumber
    ? filterSearchedDocuments(props.toBeConfirmedDocuments, searchedDocumentNumber)
    : getFilteredToBeConfirmedDocuments(props.toBeConfirmedDocuments, filterValues);

  return (
    <div style={styles.table}>
      <DocumentsTableHeader
        isLoading={props.isLoading}
        refetch={props.refetch}
        resultsCount={filteredToBeConfirmedDocuments.length}
        filters={filters}
        searchedDocumentNumber={searchedDocumentNumber}
        setSearchedDocumentNumber={setAndStoreSearchedDocumentNumber}
      />
      <div style={styles.tableContentContainer}>
        <ToBeConfirmedDocumentsTable
          users={props.users}
          toBeConfirmedDocuments={filteredToBeConfirmedDocuments}
          refetch={props.refetch}
        />
      </div>
    </div>
  );

  function buildFilters(): Partial<filtersType> {
    return {
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
    };
  }

  function setAndStoreFilterValues(filterValues: toBeConfirmedDocumentFilterType) {
    localStorage.toBeConfirmedDocumentsStateHandler.setFilters(filterValues);
    setFilterValues(filterValues);
  }

  function setAndStoreSearchedDocumentNumber(searchedDocumentNumber: number | undefined) {
    localStorage.toBeConfirmedDocumentsStateHandler.setSearchedDocumentNumber(searchedDocumentNumber);
    setSearchedDocumentNumber(searchedDocumentNumber);
  }

  function extractFilterInfoFromToBeConfirmedDocuments(
    treatedDocuments: apiRouteOutType<'get', 'toBeConfirmedDocuments'>,
  ) {
    const jurisdictions = uniq(treatedDocuments.map((treatedDocument) => treatedDocument.document.jurisdiction));
    const publicationCategoryLetters = uniq(
      flatten(treatedDocuments.map((treatedDocument) => treatedDocument.document.publicationCategory)),
    );
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
    return { jurisdictions, publicationCategoryLetters, userNames, maxDate, minDate };
  }

  function getFilteredToBeConfirmedDocuments(
    toBeConfirmedDocuments: apiRouteOutType<'get', 'toBeConfirmedDocuments'>,
    filterValues: toBeConfirmedDocumentFilterType,
  ) {
    return toBeConfirmedDocuments.filter((toBeConfirmedDocument) => {
      return keysOf(filterValues).reduce((accumulator, currentFilterKey) => {
        if (currentFilterKey === 'jurisdiction' && !!filterValues[currentFilterKey]) {
          return accumulator && toBeConfirmedDocument.document.jurisdiction === filterValues.jurisdiction;
        }
        if (currentFilterKey === 'startDate' && !!filterValues.startDate) {
          return (
            accumulator &&
            toBeConfirmedDocument.lastTreatmentDate !== undefined &&
            toBeConfirmedDocument.lastTreatmentDate >= filterValues.startDate.getTime()
          );
        }
        if (currentFilterKey === 'endDate' && !!filterValues.endDate) {
          return (
            accumulator &&
            toBeConfirmedDocument.lastTreatmentDate !== undefined &&
            toBeConfirmedDocument.lastTreatmentDate <= filterValues.endDate.getTime()
          );
        }
        if (currentFilterKey === 'userName' && !!filterValues.userName) {
          return accumulator && toBeConfirmedDocument.userNames.includes(filterValues.userName);
        }
        if (currentFilterKey === 'documentReviewFilterStatus' && !!filterValues.documentReviewFilterStatus) {
          return (
            accumulator &&
            convertDocumentReviewStatusToFilter(toBeConfirmedDocument.document.reviewStatus) ===
              filterValues.documentReviewFilterStatus
          );
        }
        if (currentFilterKey === 'publicationCategoryLetter' && !!filterValues.publicationCategoryLetter) {
          return (
            accumulator &&
            toBeConfirmedDocument.document.publicationCategory.includes(filterValues.publicationCategoryLetter)
          );
        }
        return accumulator;
      }, true as boolean);
    });
  }

  function filterSearchedDocuments(
    toBeConfirmedDocuments: apiRouteOutType<'get', 'toBeConfirmedDocuments'>,
    searchedDocumentNumber: number,
  ) {
    return toBeConfirmedDocuments.filter((treatedDocument) =>
      treatedDocument.document.documentNumber.toString().includes(searchedDocumentNumber.toString()),
    );
  }

  function buildStyles(theme: customThemeType) {
    return {
      tableHeaderContainer: {
        height: heights.adminTreatmentsTableHeader,
      },
      tableHeader: {
        paddingTop: theme.spacing * 2,
        paddingRight: theme.spacing * 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      tableRightHeader: {
        display: 'flex',
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
}
