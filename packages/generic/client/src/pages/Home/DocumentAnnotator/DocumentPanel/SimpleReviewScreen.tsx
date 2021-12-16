import React from 'react';
import { Icon, Text } from '../../../../components';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { wordings } from '../../../../wordings';

export { SimpleReviewScreen };

const ICON_SIZE = 88;

function SimpleReviewScreen() {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <div style={styles.container}>
      <div style={styles.contentContainer}>
        <Icon style={styles.icon} iconName="meditation" />
        <Text weight="bold" style={styles.title}>
          {wordings.homePage.simpleReviewScreen.title}
        </Text>
        <Text style={styles.subtitle}>{wordings.homePage.simpleReviewScreen.subtitle}</Text>
      </div>
    </div>
  );
}

function buildStyles(theme: customThemeType) {
  return {
    container: {
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
    },
    contentContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '50%',
    },
    icon: {
      height: ICON_SIZE,
      width: ICON_SIZE,
      color: theme.colors.icon,
    },
    title: {
      marginTop: theme.spacing * 3,
      textAlign: 'center',
    },
    subtitle: {
      marginTop: theme.spacing * 2,
      textAlign: 'center',
    },
  } as const;
}
