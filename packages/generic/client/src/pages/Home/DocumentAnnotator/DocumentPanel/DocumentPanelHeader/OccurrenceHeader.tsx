import React from 'react';
import { customThemeType, heights, useCustomTheme } from '../../../../../styles';
import { Header, IconButton } from '../../../../../components';
import { wordings } from '../../../../../wordings';
import { useDocumentViewerModeHandler } from '../../../../../services/documentViewerMode';

export { OccurrenceHeader };

function OccurrenceHeader() {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const documentViewerModeHandler = useDocumentViewerModeHandler();
  return (
    <Header
      leftHeaderComponents={[]}
      rightHeaderComponents={[
        <IconButton iconName="close" hint={wordings.cancel} onClick={documentViewerModeHandler.resetViewerMode} />,
      ]}
      spaceBetweenComponents={0}
      variant="mainLeft"
      style={styles.header}
    />
  );
}

function buildStyles(theme: customThemeType) {
  return {
    header: {
      paddingRight: theme.spacing * 2,
      height: heights.panelHeader,
    },
  };
}
