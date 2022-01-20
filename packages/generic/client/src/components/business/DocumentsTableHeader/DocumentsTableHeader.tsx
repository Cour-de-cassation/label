import React from 'react';
import { customThemeType, useCustomTheme, RefreshButton } from 'pelta-design-system';
import { filtersType } from '../../../services/filters';
import { heights } from '../../../styles';
import { DocumentNumberTextInput } from '../DocumentNumberTextInput';
import { DocumentsFilters } from './DocumentsFilters';

export { DocumentsTableHeader };

function DocumentsTableHeader(props: {
  refetch: () => void;
  isLoading: boolean;
  filters: Partial<filtersType>;
  setSearchedDocumentNumber: (documentNumber: number | undefined) => void;
  resultsCount: number;
  searchedDocumentNumber: number | undefined;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <div style={styles.tableHeaderContainer}>
      <div style={styles.tableHeader}>
        <DocumentsFilters filters={props.filters} resultsCount={props.resultsCount} />
        <div style={styles.tableRightHeader}>
          <div style={styles.searchTextInputContainer}>
            <DocumentNumberTextInput value={props.searchedDocumentNumber} onChange={props.setSearchedDocumentNumber} />
          </div>
          <RefreshButton onClick={props.refetch} isLoading={props.isLoading} />
        </div>
      </div>
    </div>
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
    searchTextInputContainer: {
      marginRight: theme.spacing * 2,
    },
  } as const;
}
