import React from 'react';
import { Header, SwitchButton, Text } from '../../../../../components';
import { heights, useCustomTheme } from '../../../../../styles';
import { wordings } from '../../../../../wordings';
import { useDocumentViewerModeHandler } from '../../../../../services/documentViewerMode';

export { AnnotationHeader };

function AnnotationHeader() {
  const theme = useCustomTheme();
  const documentViewerModeHandler = useDocumentViewerModeHandler();
  const style = buildStyle();

  return (
    <Header
      leftHeaderComponents={[]}
      rightHeaderComponents={[
        <Text>{wordings.anonymisedView}</Text>,
        <SwitchButton
          checked={documentViewerModeHandler.isAnonymizedView()}
          color="primary"
          onChange={documentViewerModeHandler.switchAnonymizedView}
        />,
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
