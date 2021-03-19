import React from 'react';
import { Text } from '../../components';
import { customThemeType, useCustomTheme } from '../../styles';
import { wordings } from '../../wordings';

export { LoadingPage };

function LoadingPage() {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <div style={styles.container}>
      <div style={styles.loadingPage}>
        <div className="loading-wheel" style={styles.loadingWheel} />
        <Text>{wordings.loadingPage}</Text>
      </div>
    </div>
  );

  function buildStyles(theme: customThemeType) {
    return {
      container: {
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadingPage: {
        display: 'flex',
        flexDirection: 'column',
      },
      loadingWheel: {
        color: theme.colors.line.level1,
      },
    } as const;
  }
}
