import React, { CSSProperties } from 'react';
import { uniq } from 'lodash';
import { annotationLinkHandler, annotationModule, settingsModule } from '@label/core';
import { CategoryIcon, Header, IconButton, Text } from '../../../../../components';
import { useAnnotatorStateHandler } from '../../../../../services/annotatorState';
import { useDocumentViewerModeHandler } from '../../../../../services/documentViewerMode';
import { customThemeType, heights, useCustomTheme } from '../../../../../styles';
import { wordings } from '../../../../../wordings';

export { OccurrenceHeader };

const CATEGORY_ICON_SIZE = 40;

function OccurrenceHeader(props: { entityId: string }) {
  const documentViewerModeHandler = useDocumentViewerModeHandler();
  const theme = useCustomTheme();
  const annotatorStateHandler = useAnnotatorStateHandler();

  const styles = buildStyles(theme);
  const { annotations, settings } = annotatorStateHandler.get();
  const category = annotationModule.lib.entityIdHandler.getCategory(props.entityId);
  const categoryName = settingsModule.lib.getAnnotationCategoryText(category, settings);
  const annotationTexts = uniq(
    annotationLinkHandler
      .getLinkedAnnotationRepresentatives(props.entityId, annotations)
      .map((annotation) => annotation.text),
  );
  return (
    <Header
      leftHeaderComponents={[
        <div style={styles.leftHeader}>
          <CategoryIcon category={category} iconSize={CATEGORY_ICON_SIZE} settings={settings} />
          <div style={styles.categoryInfosContainer}>
            <Text>{categoryName}</Text>
            <Text variant="body2">{annotationTexts.join(' — ')}</Text>
          </div>
        </div>,
      ]}
      rightHeaderComponents={[
        <IconButton
          iconName="close"
          hint={wordings.homePage.close}
          onClick={documentViewerModeHandler.resetViewerMode}
        />,
      ]}
      spaceBetweenComponents={0}
      variant="mainLeft"
      style={styles.header}
    />
  );
}

function buildStyles(theme: customThemeType): { [cssClass: string]: CSSProperties } {
  return {
    header: {
      paddingRight: theme.spacing * 2,
      height: heights.annotatorPanelHeader,
    },
    leftHeader: {
      display: 'flex',
    },
    categoryInfosContainer: {
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: theme.spacing,
    },
  };
}
