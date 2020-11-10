import React from 'react';
import { Header, IconButton } from '../../../../../components';
import { heights, useCustomTheme } from '../../../../../styles';
import { wordings } from '../../../../../wordings';

export { ResizeHeader };

function ResizeHeader(props: { resetHeaderMode: () => void }) {
  const theme = useCustomTheme();
  const style = buildStyle();

  return (
    <Header
      leftHeaderComponents={[]}
      rightHeaderComponents={[
        <IconButton color="default" hint={wordings.cancel} iconName="close" onClick={props.resetHeaderMode} />,
      ]}
      spaceBetweenComponents={theme.spacing * 2}
      style={style.header}
      variant="classic"
    />
  );

  function buildStyle() {
    return {
      header: {
        height: heights.panelHeader,
      },
    };
  }
}
