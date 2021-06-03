import React, { useState } from 'react';
import { uniq, flatten } from 'lodash';
import { apiRouteOutType, keysOf } from '@label/core';
import { DecisionNumberTextInput, IconButton } from '../../../components';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { UntreatedDocumentsTable } from './UntreatedDocumentsTable';
import { untreatedDocumentFilterType, UntreatedDocumentsFilters } from './UntreatedDocumentsFilters';

export { UntreatedDocuments };

const DEFAULT_FILTERS = {
  source: undefined,
  publicationCategoryLetter: undefined,
};

function UntreatedDocuments(props: {
  untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>;
  refetch: () => void;
}) {
  const [filterValues, setFilterValues] = useState<untreatedDocumentFilterType>(DEFAULT_FILTERS);
  const [searchedDecisionNumber, setSearchedDecisionNumber] = useState<number | undefined>();
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  const filterInfo = extractFilterInfoFromDocuments(props.untreatedDocuments);
  const filteredUntreatedDocuments = searchedDecisionNumber
    ? filterSearchedDecisions(props.untreatedDocuments, searchedDecisionNumber)
    : getFilteredUntreatedDocuments(props.untreatedDocuments, filterValues);
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
          <div style={styles.tableRightHeader}>
            <div style={styles.searchTextInputContainer}>
              <DecisionNumberTextInput value={searchedDecisionNumber} onChange={setSearchedDecisionNumber} />
            </div>
            <IconButton
              backgroundColor="primary"
              onClick={props.refetch}
              hint={wordings.shared.refresh}
              iconName="reset"
            />
          </div>
        </div>
      </div>
      <div style={styles.tableContentContainer}>
        <UntreatedDocumentsTable untreatedDocuments={filteredUntreatedDocuments} refetch={props.refetch} />
      </div>
    </div>
  );

  function getFilteredUntreatedDocuments(
    untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>,
    filterValues: untreatedDocumentFilterType,
  ) {
    return untreatedDocuments.filter((untreatedDocument) => {
      return keysOf(filterValues).reduce((accumulator, currentFilterKey) => {
        if (currentFilterKey === 'publicationCategoryLetter' && !!filterValues.publicationCategoryLetter) {
          return (
            accumulator &&
            untreatedDocument.document.publicationCategory.includes(filterValues.publicationCategoryLetter)
          );
        }
        if (currentFilterKey === 'source' && !!filterValues.source) {
          return accumulator && untreatedDocument.document.source === filterValues.source;
        }
        return accumulator;
      }, true as boolean);
    });
  }

  function filterSearchedDecisions(
    untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>,
    searchedDecisionNumber: number,
  ) {
    return untreatedDocuments.filter((untreatedDocument) =>
      untreatedDocument.document.documentNumber.toString().includes(searchedDecisionNumber.toString()),
    );
  }

  function extractFilterInfoFromDocuments(untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>) {
    const publicationCategoryLetters = uniq(
      flatten(untreatedDocuments.map((untreatedDocument) => untreatedDocument.document.publicationCategory)),
    );
    const sources = uniq(untreatedDocuments.map((untreatedDocument) => untreatedDocument.document.source));
    return { publicationCategoryLetters, sources };
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
}
