import React from 'react';
import { settingsModule, fetchedDocumentType, documentModule } from '@label/core';
import { Icon, Text, customThemeType, getColor, useCustomTheme, useDisplayMode } from 'pelta-design-system';
import { heights } from '../../../../styles';
import { wordings } from '../../../../wordings';
import { annotationPerCategoryAndEntityType, splittedTextByLineType } from '../lib';
import { CategoryTable } from './CategoryTable';
import { EmptyCategory } from './EmptyCategory';
import { StrickenCategory } from './StrickenCategory';

export { AnnotationsPanel };

function AnnotationsPanel(props: {
  document: fetchedDocumentType;
  annotationPerCategoryAndEntity: annotationPerCategoryAndEntityType;
  splittedTextByLine: splittedTextByLineType;
  nonAnnotableCategories: string[];
}) {
  const theme = useCustomTheme();
  const { displayMode } = useDisplayMode();
  const styles = buildStyles(theme);

  return (
    <div style={styles.panel}>
      <div style={styles.panelHeader}>
        <Text variant="h2" weight="bold">
          {wordings.homePage.askedAnnotations}
        </Text>
      </div>
      <div style={styles.categoriesContainer}>
        {props.annotationPerCategoryAndEntity.map(({ category, categorySize, categoryAnnotations }) => {
          const isCategoryAdditionalAnnotationCategory =
            category === settingsModule.lib.additionalAnnotationCategoryHandler.getCategoryName();

          return (
            <div key={category} style={styles.categoryContainer}>
              {isCategoryAdditionalAnnotationCategory &&
                renderAdditionalAnnotationTerms(props.document.decisionMetadata.additionalTermsToAnnotate)}
              <div>{renderCategory({ category, categorySize, categoryAnnotations })}</div>
            </div>
          );
        })}
        {props.nonAnnotableCategories.map((category) => (
          <div key={category} style={styles.categoryContainer}>
            <StrickenCategory category={category} />
          </div>
        ))}
      </div>
    </div>
  );

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
    const annotationTerms = documentModule.lib.extractAdditionalAnnotationTerms(additionalTermsToAnnotate);
    return (
      <div style={styles.additionalAnnotationTermsContainer}>
        <div style={styles.additionalAnnotationTermsLeftContainer}>
          <Icon iconName={settingsModule.lib.additionalAnnotationCategoryHandler.getCategoryIconName()} />
        </div>
        <div style={styles.additionalAnnotationTermsRightContainer}>
          <Text>{wordings.homePage.askedAdditionalOccultations}</Text>
          {annotationTerms.map((annotationTerm) => (
            <Text variant="body2">{annotationTerm}</Text>
          ))}
        </div>
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
        padding: theme.spacing * 2,
        marginBottom: theme.spacing,
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
        borderRadius: theme.shape.borderRadius.l,
        backgroundColor: getColor(settingsModule.lib.additionalAnnotationCategoryHandler.getCategoryColor(displayMode)),
      },
      additionalAnnotationTermsLeftContainer: {
        marginRight: theme.spacing * 3,
      },
      additionalAnnotationTermsRightContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
      },
      categoryContainer: {
        marginBottom: theme.spacing,
      },
    } as const;
  }
}
