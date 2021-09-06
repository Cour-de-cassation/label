import React from 'react';
import { settingsModule, fetchedDocumentType } from '@label/core';
import { Text } from '../../../../components';
import { customThemeType, heights, useCustomTheme } from '../../../../styles';
import { wordings } from '../../../../wordings';
import { annotationPerCategoryAndEntityType, splittedTextByLineType } from '../lib';
import { CategoryTable } from './CategoryTable';
import { EmptyCategory } from './EmptyCategory';

export { AnnotationsPanel };

function AnnotationsPanel(props: {
  document: fetchedDocumentType;
  annotationPerCategoryAndEntity: annotationPerCategoryAndEntityType;
  splittedTextByLine: splittedTextByLineType;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <div style={styles.panel}>
      <div style={styles.panelHeader}>
        <Text variant="h2" weight="bold">
          {wordings.homePage.askedAnnotations}
        </Text>
        <div style={styles.annotationGuideContainer} onClick={openLink}>
          <Text variant="h3">{wordings.homePage.annotationGuide}</Text>
        </div>
      </div>
      <div style={styles.categoriesContainer}>
        {props.annotationPerCategoryAndEntity.map(({ category, categorySize, categoryAnnotations }) => {
          const isCategoryAdditionalAnnotationCategory =
            category === settingsModule.lib.additionalAnnotationCategoryHandler.getCategoryName();
          const categoryContainerStyle = isCategoryAdditionalAnnotationCategory
            ? styles.additionalAnnotationCategoryContainer
            : styles.categoryContainer;

          return (
            <div key={category} style={categoryContainerStyle}>
              {renderCategory({ category, categorySize, categoryAnnotations })}
              {isCategoryAdditionalAnnotationCategory &&
                renderAdditionalAnnotationTerms(props.document.decisionMetadata.additionalTermsToAnnotate)}
            </div>
          );
        })}
      </div>
    </div>
  );

  function openLink() {
    const url = 'https://edps.europa.eu/sites/default/files/publication/21-01-20_edps_brochures_fr.pdf';
    window.open(url, '_blank');
  }

  function renderCategory({ category, categorySize, categoryAnnotations }: annotationPerCategoryAndEntityType[number]) {
    return categorySize > 0 ? (
      <CategoryTable
        categoryAnnotations={categoryAnnotations}
        category={category}
        categorySize={categorySize}
        splittedTextByLine={props.splittedTextByLine}
      />
    ) : (
      <EmptyCategory category={category} />
    );
  }

  function renderAdditionalAnnotationTerms(additionalTermsToAnnotate: string) {
    return (
      <div style={styles.additionalAnnotationTermsContainer}>
        <Text>{additionalTermsToAnnotate}</Text>
      </div>
    );
  }

  function buildStyles(theme: customThemeType) {
    return {
      panel: {
        width: '100%',
        paddingLeft: theme.spacing * 2,
        paddingRight: theme.spacing * 4,
      },
      panelHeader: {
        height: heights.annotatorPanelHeader,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      annotationGuideContainer: {
        paddingRight: theme.spacing * 2,
        cursor: 'pointer',
      },
      categoriesContainer: {
        overflowY: 'auto',
        height: heights.annotatorPanel,
        paddingRight: theme.spacing * 2,
      },
      additionalAnnotationTermsContainer: {
        marginTop: theme.spacing,
        marginRight: theme.spacing,
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-end',
      },
      additionalAnnotationCategoryContainer: {
        marginBottom: theme.spacing * 3,
      },
      categoryContainer: {
        marginBottom: theme.spacing,
      },
    } as const;
  }
}
