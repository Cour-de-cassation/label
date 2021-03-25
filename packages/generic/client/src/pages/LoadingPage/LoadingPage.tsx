import React from 'react';
import { Text, Loader } from '../../components';
import { customThemeType, useCustomTheme } from '../../styles';
import { wordings } from '../../wordings';

export { LoadingPage };

const LOADER_SIZE = 100;

function LoadingPage() {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <div style={styles.container}>
      <div style={styles.loadingPage}>
        <div style={styles.loaderContainer}>
          <Loader size={LOADER_SIZE} />
        </div>
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
        alignItems: 'center',
      },
      loaderContainer: {
        marginBottom: theme.spacing * 4,
      },
    } as const;
  }
}
