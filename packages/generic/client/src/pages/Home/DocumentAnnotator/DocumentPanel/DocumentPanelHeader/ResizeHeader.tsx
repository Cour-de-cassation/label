import React from 'react';
import { fetchedAnnotationType } from '@label/core';
import { Header, Icon, IconButton, Text } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { heights, useCustomTheme } from '../../../../../styles';
import { wordings } from '../../../../../wordings';

export { ResizeHeader };

function ResizeHeader(props: {
  annotationToResize: fetchedAnnotationType;
  annotatorStateHandler: annotatorStateHandlerType;
  resetViewerMode: () => void;
}) {
  const theme = useCustomTheme();
  const style = buildStyle();

  return (
    <Header
      leftHeaderComponents={[<Icon iconName="resize"></Icon>, <Text>{wordings.selectResizedText}</Text>]}
      rightHeaderComponents={[
        <IconButton color="default" hint={wordings.cancel} iconName="close" onClick={cancelResize} />,
      ]}
      spaceBetweenComponents={theme.spacing * 2}
      style={style.header}
      variant="mainLeft"
    />
  );

  function cancelResize() {
    props.annotatorStateHandler.cancelLastChange();
    props.resetViewerMode();
  }

  function buildStyle() {
    return {
      header: {
        height: heights.panelHeader,
      },
    };
  }
}
