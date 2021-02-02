import React, { ReactElement } from 'react';
import { useDocumentViewerModeHandler } from '../../../../services/documentViewerMode';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { clientAnonymizerType } from '../../../../types';
import { splittedTextByLineType } from '../lib';
import { DocumentPanelHeader } from './DocumentPanelHeader';
import { DocumentViewer } from './DocumentViewer';

export { DocumentPanel };

function DocumentPanel(props: {
  anonymizer: clientAnonymizerType;
  splittedTextByLine: splittedTextByLineType;
}): ReactElement {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const { setHasScrolled } = useDocumentViewerModeHandler();
  return (
    <div style={styles.panel} onScroll={onScroll}>
      <DocumentPanelHeader />
      <DocumentViewer anonymizer={props.anonymizer} splittedTextByLine={props.splittedTextByLine} />
    </div>
  );

  function onScroll() {
    setHasScrolled();
  }
}

function buildStyles(theme: customThemeType) {
  return {
    panel: {
      width: '100%',
      paddingRight: theme.spacing * 2,
    },
  };
}
