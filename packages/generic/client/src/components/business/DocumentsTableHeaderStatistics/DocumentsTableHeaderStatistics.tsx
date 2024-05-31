import React from 'react';
import { customThemeType, useCustomTheme } from 'pelta-design-system';
import { heights } from '../../../styles';
import { DocumentNumberTextInput } from '../DocumentNumberTextInput';
import { StatisticsFilterButton } from '../../../pages/Admin/Statistics/StatisticsFilterButton';
import { apiRouteOutType, documentType, ressourceFilterType, userType } from '@label/core';
import { apiCaller } from '../../../api';
import { documentStatsType } from '../../../pages/Admin/Statistics/StatisticsBox/DocumentStatisticsBox';

export { DocumentsTableHeaderStatistics };

function DocumentsTableHeaderStatistics(props: {
  availableStatisticFilters: apiRouteOutType<'get', 'availableStatisticFilters'>;
  users: Pick<userType, '_id' | 'name'>[];
  refetch: (ressourceFilter: ressourceFilterType) => void;
  isLoading: boolean;
  ressourceFilter: ressourceFilterType;
  setSearchedDocumentNumber: (documentNumber: number | undefined) => void;
  documentNumber: number | undefined;
  documentStatistics: (data: Array<documentStatsType>) => void;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <div style={styles.tableHeaderContainer}>
      <div style={styles.tableHeader}>
        <StatisticsFilterButton
          availableStatisticFilters={props.availableStatisticFilters}
          users={props.users}
          refetch={props.refetch}
          isLoading={props.isLoading}
          ressourceFilter={props.ressourceFilter}
        />
        <div style={styles.tableRightHeader}>
          <div style={styles.searchTextInputContainer}>
            <DocumentNumberTextInput
              value={props.documentNumber}
              onChange={(documentNumber) => {
                props.setSearchedDocumentNumber(documentNumber);
                buildFetchDocumentStatistics(documentNumber ?? 0).then((documentStatistics) => {
                  props.documentStatistics(documentStatistics.data as any);
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const buildFetchDocumentStatistics = async (documentNumber: documentType['documentNumber']) => {
  return await apiCaller.get<'documentStatistics'>('documentStatistics', { documentNumber });
};

function buildStyles(theme: customThemeType) {
  return {
    tableHeaderContainer: {
      height: heights.adminTreatmentsTableHeader,
    },
    tableHeader: {
      paddingTop: theme.spacing * 4,
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
