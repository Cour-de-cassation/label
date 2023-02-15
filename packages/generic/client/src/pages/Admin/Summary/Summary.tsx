import React from 'react';
import { apiRouteOutType } from '@label/core';
import { customThemeType, useCustomTheme, Text, RefreshButton } from 'pelta-design-system';
import { heights, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { SummaryBox } from './SummaryBox';

export { Summary };

const WIDTH = 350;

function Summary(props: { summary: apiRouteOutType<'get', 'summary'>; refetch: () => void; isLoading: boolean }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <RefreshButton onClick={props.refetch} isLoading={props.isLoading} />
      </div>
      <div style={styles.body}>
        <div style={styles.welcomeMessage}>
          <Text variant="h1" style={styles.welcomeTitle}>
            {wordings.summaryPage.welcomeMessage}
          </Text>
        </div>
        <SummaryBox summary={props.summary} width={WIDTH} />
      </div>
    </div>
  );
}

function buildStyles(theme: customThemeType) {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      width: widths.adminContent,
      paddingLeft: theme.spacing * 3,
      paddingRight: theme.spacing * 2,
    },
    header: {
      height: heights.statisticsHeaderHeight,
      paddingTop: theme.spacing * 5,
      paddingRight: theme.spacing * 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    body: {
      height: heights.statisticsBodyHeight,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    welcomeMessage: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: theme.spacing * 7,
    },
    welcomeTitle: {
      fontSize: '50px',
    },
  } as const;
}
