import React from 'react';
import { useCustomTheme, Header, IconButton, Text, Icon, customThemeType } from 'pelta-design-system';
import { heights } from '../../../../../styles';
import { wordings } from '../../../../../wordings';
import { useDocumentViewerModeHandler } from '../../../../../services/documentViewerMode';

export { ChecklistHeader };

const HELP_ICON_SIZE = 40;

function ChecklistHeader(props: { message: string }) {
  const { resetViewerMode } = useDocumentViewerModeHandler();
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <Header
      leftHeaderComponents={[
        <div style={styles.leftHeader}>
          <div style={styles.checkIconContainer}>
            <Icon iconName="help" />
          </div>
          <div style={styles.checkInfosContainer}>
            <Text variant="body2" style={styles.annotationRepresentatives}>
              {props.message}
            </Text>
          </div>
        </div>,
      ]}
      rightHeaderComponents={[<IconButton iconName="close" hint={wordings.homePage.close} onClick={resetViewerMode} />]}
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
      height: heights.annotatorPanelHeader,
    },
    leftHeader: {
      display: 'flex',
    },
    checkIconContainer: {
      width: HELP_ICON_SIZE,
    },
    checkInfosContainer: {
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: theme.spacing,
    },
    annotationRepresentatives: {
      height: theme.typography.body2.normal.lineHeight,
    },
  } as const;
}
