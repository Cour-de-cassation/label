import React from 'react';
import { MainHeader, Text } from '../../components';
import { customThemeType, useCustomTheme } from '../../styles';
import { wordings } from '../../wordings';

export { LoadingPage };

function LoadingPage(props: { displayHeader?: boolean }) {
  const theme = useCustomTheme();
  const style = buildStyle(theme);

  return (
    <>
      {props.displayHeader && <MainHeader />}
      <span style={style.loadingPage}>
        <div className="loading-wheel" style={style.loadingWheel} />
        <Text>{wordings.loadingPage}</Text>
      </span>
    </>
  );

  function buildStyle(theme: customThemeType) {
    return {
      loadingPage: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
      loadingWheel: {
        color: theme.colors.line.level1,
      },
    } as const;
  }
}
