import React from 'react';
import { settingsModule, fetchedDocumentType, annotationReportType } from '@label/core';
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
  checklist: annotationReportType['checklist'];
  splittedTextByLine: splittedTextByLineType;
  nonAnnotableCategories: string[];
}) {
  const ICON_SIZE = 18;

  const theme = useCustomTheme();
  const { displayMode } = useDisplayMode();
  const styles = buildStyles(theme);

  return (
    <div style={styles.panel}>
      <div style={styles.panelHeader}>
        <Text variant="h2" weight="bold">
          {wordings.homePage.askedAnnotations}
        </Text>
        <Text variant="h3">
          <a
            href="file://nms81-cassation/Data/SDER-SCOM-SRI/2-SDER/1-Bureaux/8-BDN-CA/3-ANO/guide_annotation.pdf"
            target="_blank"
            rel="noreferrer"
            style={styles.annotationGuideLink}
          >
            {wordings.homePage.annotationGuide}
            <Icon iconName="help" style={styles.annotationGuideIcon} />
          </a>
        </Text>
      </div>
      <div style={styles.categoriesContainer}>

        {props.document.decisionMetadata.partiallyPublic && (
          <div key={'partiallyPublic'} style={styles.categoryContainer}>
            {renderPartiallyPublic()}
          </div>
        )}

        {props.checklist && props.checklist.length > 0 && (
          <div key={'checklist'} style={styles.categoryContainer}>
            {renderChecklist(props.checklist)}
          </div>
        )}
        {props.annotationPerCategoryAndEntity.map(({ category, categorySize, categoryAnnotations }) => {
          const isCategoryAdditionalAnnotationCategory =
            category === settingsModule.lib.additionalAnnotationCategoryHandler.getCategoryName();

          return (
            <div key={category} style={styles.categoryContainer}>
              {isCategoryAdditionalAnnotationCategory &&
                renderAdditionalAnnotationTerms(
                  props.document.decisionMetadata.additionalTermsToAnnotate,
                  props.document.decisionMetadata.computedAdditionalTerms,
                  props.document.decisionMetadata.additionalTermsParsingFailed,
                )}
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

  function renderAdditionalAnnotationTerms(
    additionalTermsToAnnotate: string,
    computedAdditionalTerms?: { additionalTermsToAnnotate: string[]; additionalTermsToUnAnnotate: string[] },
    additionalTermsParsingFailed?: boolean,
  ) {
    if (
      additionalTermsParsingFailed ||
      (additionalTermsParsingFailed == undefined && additionalTermsToAnnotate !== '') ||
      (computedAdditionalTerms?.additionalTermsToAnnotate != undefined &&
        computedAdditionalTerms.additionalTermsToAnnotate.length > 0) ||
      (computedAdditionalTerms?.additionalTermsToUnAnnotate != undefined &&
        computedAdditionalTerms.additionalTermsToUnAnnotate.length > 0)
    ) {
      return (
        <div style={styles.additionalAnnotationTermsContainer}>
          <div style={styles.additionalAnnotationTermsLeftContainer}>
            <Icon iconName={settingsModule.lib.additionalAnnotationCategoryHandler.getCategoryIconName()} />
          </div>
          <div style={styles.additionalAnnotationTermsRightContainer}>
            {(additionalTermsParsingFailed ||
              (additionalTermsParsingFailed == undefined && additionalTermsToAnnotate !== '')) && (
              <>
                <Text>{wordings.homePage.additionalTermsParsingFailed}</Text>
              </>
            )}

            {(computedAdditionalTerms?.additionalTermsToAnnotate != undefined &&
              computedAdditionalTerms.additionalTermsToAnnotate.length > 0) ||
            (computedAdditionalTerms?.additionalTermsToUnAnnotate != undefined &&
              computedAdditionalTerms.additionalTermsToUnAnnotate.length > 0) ? (
              <>
                <Text>{wordings.homePage.askedAdditionalOccultations}</Text>
                {computedAdditionalTerms?.additionalTermsToAnnotate != undefined &&
                  computedAdditionalTerms.additionalTermsToAnnotate.length > 0 && (
                    <>
                      <Text>{wordings.homePage.additionalTermsToAnnotate}</Text>
                      {computedAdditionalTerms.additionalTermsToAnnotate.map((term) => (
                        <Text variant="body2">- {term}</Text>
                      ))}
                    </>
                  )}
                {computedAdditionalTerms?.additionalTermsToUnAnnotate != undefined &&
                  computedAdditionalTerms.additionalTermsToUnAnnotate.length > 0 && (
                    <>
                      <Text>{wordings.homePage.additionalTermsToUnAnnotate}</Text>
                      {computedAdditionalTerms.additionalTermsToUnAnnotate.map((term) => (
                        <Text variant="body2">- {term}</Text>
                      ))}
                    </>
                  )}
              </>
            ) : (
              <>
                <Text>{wordings.homePage.promptRawAdditionalTermsText}</Text>
                <Text variant="body2">{additionalTermsToAnnotate}</Text>
              </>
            )}
          </div>
        </div>
      );
    }
  }

  function renderChecklist(checklist: string[]) {
    return (
      <div style={styles.checklistContainer}>
        <div style={styles.checklistLeftContainer}>
          <Icon iconName={'help'} />
        </div>
        <div style={styles.checklistRightContainer}>
          <Text>{wordings.homePage.checklist}</Text>
          {checklist.map((checklistElement) => (
            <Text variant="body2">- {checklistElement}</Text>
          ))}
        </div>
      </div>
    );
  }

  function renderPartiallyPublic() {
    return (
      <div style={styles.partiallyPublicContainer}>
        <div style={styles.partiallyPublicLeftContainer}>
          <Icon iconName={'eyeoff'} />
        </div>
        <div style={styles.partiallyPublicRightContainer}>
          <Text>Cette décision est partiellement publique, les motifs seront occultés.</Text>
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
        flexDirect: 'row',
        justifyContent: 'space-between',
      },
      annotationGuideLink: {
        color: theme.colors.line.level2,
        textDecoration: 'none',
        cursor: 'pointer',
      },
      annotationGuideIcon: {
        fontSize: `${ICON_SIZE}px`,
        position: 'relative',
        top: `${ICON_SIZE / 4}px`,
        paddingLeft: theme.spacing / 2,
      },
      categoriesContainer: {
        overflowY: 'auto',
        height: heights.annotatorPanel,
        paddingRight: theme.spacing * 2,
      },
      partiallyPublicContainer: {
        padding: theme.spacing * 2,
        marginBottom: theme.spacing,
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
        borderRadius: theme.shape.borderRadius.l,
        backgroundColor: "orange",
      },
      partiallyPublicLeftContainer: {
        marginRight: theme.spacing * 3,
      },
      partiallyPublicRightContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
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
      checklistContainer: {
        padding: theme.spacing * 2,
        marginBottom: theme.spacing,
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
        borderRadius: theme.shape.borderRadius.l,
      },
      checklistLeftContainer: {
        marginRight: theme.spacing * 3,
      },
      checklistRightContainer: {
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
