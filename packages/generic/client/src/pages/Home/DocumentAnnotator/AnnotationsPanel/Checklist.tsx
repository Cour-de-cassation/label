import React from 'react';
import { annotationReportType } from '@label/core';
import { customThemeType, Icon, Text, useCustomTheme } from 'pelta-design-system';
import { wordings } from '../../../../wordings';

export { Checklist };

function Checklist(props: { checklist: annotationReportType['checklist'] }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <div style={styles.checklistContainer}>
      <div style={styles.checklistLeftContainer}>
        <Icon iconName={'help'} />
      </div>
      <div style={styles.checklistRightContainer}>
        <Text>{wordings.homePage.checklist}</Text>
        {props.checklist.map((checklistElement, index) => {
          return (
            <Text key={index} variant="body2">
              - {checklistElement.message}
            </Text>
          );
        })}
      </div>
    </div>
  );

  function buildStyles(theme: customThemeType) {
    return {
      checklistContainer: {
        padding: theme.spacing * 2,
        marginBottom: theme.spacing,
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
        borderRadius: theme.shape.borderRadius.l,
      },
      checklistLeftContainer: {
        marginRight: theme.spacing * 3,
      },
      checklistRightContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
      },
    } as const;
  }
}
