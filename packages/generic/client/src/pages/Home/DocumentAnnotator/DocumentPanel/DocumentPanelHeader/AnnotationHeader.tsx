import React from 'react';
import { useCustomTheme, Header } from 'pelta-design-system';
import { heights } from '../../../../../styles';

export { AnnotationHeader };

function AnnotationHeader() {
  const theme = useCustomTheme();
  const style = buildStyle();

  return (
    <Header
      leftHeaderComponents={[]}
      rightHeaderComponents={[]}
      spaceBetweenComponents={theme.spacing * 2}
      style={style.header}
      variant="classic"
    />
  );

  function buildStyle() {
    return {
      header: {
        height: heights.annotatorPanelHeader,
      },
    };
  }
}
