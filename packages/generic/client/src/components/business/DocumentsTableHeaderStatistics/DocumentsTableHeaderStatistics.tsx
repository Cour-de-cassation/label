import React, { useState } from 'react';
import { customThemeType, useCustomTheme } from 'pelta-design-system';
import { heights } from '../../../styles';
import { DocumentNumberTextInput } from '../DocumentNumberTextInput';
import { StatisticsFilterButton } from '../../../pages/Admin/Statistics/StatisticsFilterButton';
import { apiRouteOutType, documentType, ressourceFilterType, statisticType, userType } from '@label/core';
import { apiCaller } from '../../../api';

export { DocumentsTableHeaderStatistics };

function DocumentsTableHeaderStatistics(props: {
  availableStatisticFilters: apiRouteOutType<'get', 'availableStatisticFilters'>;
  users: Pick<userType, '_id' | 'name'>[];
  refetch: (ressourceFilter: ressourceFilterType) => void;
  isLoading: boolean;
  ressourceFilter: ressourceFilterType;
  setSearchedDocumentNumber: (documentNumber: number | undefined) => void;
  documentNumber: number | undefined;
  documentStatistics: (data: Array<statisticType>) => void;
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
            <DocumentNumberTextInput value={props.documentNumber} onChange={
              (e) => {
                console.log('eeeeee', e)
                console.log('props.setSearchedDocumentNumber', props.setSearchedDocumentNumber(e))
                props.setSearchedDocumentNumber(e)
                buildFetchDocumentStatistics(e ?? 0).then((val) => {
                  props.documentStatistics(val.data as any)
                })
              }
            } />
          </div>
        </div>
      </div>
    </div>
  );
}


const buildFetchDocumentStatistics = async (documentNumber: documentType['documentNumber']) => {
  const data = await apiCaller.get<'documentStatistics'>('documentStatistics', { documentNumber });
  return data;
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
