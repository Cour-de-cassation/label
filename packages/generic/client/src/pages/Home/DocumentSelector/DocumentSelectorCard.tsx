import React, { useState } from 'react';
import { groupBy, orderBy, sumBy } from 'lodash';
import {
  annotationType,
  assignationType,
  documentModule,
  fetchedDocumentType,
  settingsType,
  settingsModule,
} from '@label/core';
import { customThemeType, useCustomTheme, ButtonWithIcon, ComponentsList, Icon, Text } from 'pelta-design-system';
import { CategoryIcon, PublicationCategoryBadge } from '../../../components';
import { wordings } from '../../../wordings';
import { computeGenericDocumentInfoEntries } from './computeGenericDocumentInfoEntries';
import { computeSpecificDocumentInfoEntries } from './computeSpecificDocumentInfoEntries';

export { DocumentSelectorCard };

const SPECIFIC_DOCUMENT_INFO_ENTRIES = ['chamberName', 'decisionNumber'] as const;
const GENERIC_DOCUMENT_INFO_ENTRIES = ['wordCount', 'annotations', 'linkedEntities', 'entities'] as const;
const CARD_WIDTH = 400;
const CATEGORY_ICON_SIZE = 32;
const MAX_CATEGORIES_PER_LINE = 6;
const ICONS_CONTAINER_HEIGHT = 140;

function DocumentSelectorCard(props: {
  choice: { annotations: annotationType[]; document: fetchedDocumentType; assignationId: assignationType['_id'] };
  onSelect: (choice: {
    document: fetchedDocumentType;
    annotations: annotationType[];
    assignationId: assignationType['_id'];
  }) => Promise<void>;
  settings: settingsType;
}) {
  const theme = useCustomTheme();
  const [isSelecting, setIsSelecting] = useState(false);
  const styles = buildStyles(theme);
  const specificDocumentInfoEntries = computeSpecificDocumentInfoEntries(props.choice.document);
  const genericDocumentInfoEntries = computeGenericDocumentInfoEntries(
    props.choice.document.text,
    props.choice.annotations,
  );

  const annotableCategories = settingsModule.lib.getCategories(props.settings, {
    status: ['annotable'],
    canBeAnnotatedBy: 'human',
  });

  const categoryIconsByAnnotation = computeCategoryIconNamesByEntitiesCount(
    props.choice.annotations,
    annotableCategories,
  );
  const mustBePublished = documentModule.lib.publicationHandler.mustBePublished(
    props.choice.document.publicationCategory,
  );
  return mustBePublished ? (
    <div style={styles.publishedDocumentCardContainer}>
      <div style={styles.publishedDocumentTitleContainer}>
        {props.choice.document.publicationCategory.map((publicationCategoryLetter) => (
          <div style={styles.publicationCategoryLetter} key={publicationCategoryLetter}>
            <PublicationCategoryBadge publicationCategoryLetter={publicationCategoryLetter} />
          </div>
        ))}
        <Text variant="h2" weight="bold" style={styles.publishedDocumentTitle}>
          {wordings.homePage.documentSelector.publishedDocumentTitle}
        </Text>
      </div>
      {renderCard()}
    </div>
  ) : (
    renderCard()
  );

  function renderCard() {
    return (
      <div style={styles.card}>
        <Text style={styles.title} variant="h2" weight="bold">
          {props.choice.document.decisionMetadata.jurisdiction || wordings.homePage.documentSelector.unknownJuridiction}
        </Text>

        <div style={styles.specificDocumentInfoEntryTable}>
          {SPECIFIC_DOCUMENT_INFO_ENTRIES.map((documentInfoEntry) => (
            <div key={documentInfoEntry} style={styles.documentInfoEntryRow}>
              <div style={styles.documentLabelContainer}>
                <Text>{wordings.homePage.documentSelector.specificDocumentInfoEntries[documentInfoEntry]}</Text>
              </div>
              <div style={styles.documentValueContainer}>
                <Text variant="h2" weight="bold">
                  {specificDocumentInfoEntries[documentInfoEntry]}
                </Text>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.genericDocumentInfoEntryTable}>
          {GENERIC_DOCUMENT_INFO_ENTRIES.map((documentInfoEntry) => (
            <div key={documentInfoEntry} style={styles.documentInfoEntryRow}>
              <div style={styles.documentLabelContainer}>
                <Text style={styles.documentLabelText}>
                  {wordings.homePage.documentSelector.genericDocumentInfoEntries[documentInfoEntry]}
                </Text>
              </div>
              <div style={styles.documentValueContainer}>
                <Text variant="h2" weight="bold">
                  {genericDocumentInfoEntries[documentInfoEntry]}
                </Text>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.categoryIconsContainer}>{renderCategoryIcons()}</div>
        <ButtonWithIcon
          iconName="clock"
          color="primary"
          isLoading={isSelecting}
          onClick={onSelect}
          text={wordings.homePage.documentSelector.start}
        />
      </div>
    );

    function renderCategoryIcons() {
      if (categoryIconsByAnnotation.length <= MAX_CATEGORIES_PER_LINE) {
        return (
          <ComponentsList
            components={categoryIconsByAnnotation.map(renderCategoryIconWithCount)}
            spaceBetweenComponents={theme.spacing * 3}
          />
        );
      }
      if (categoryIconsByAnnotation.length <= 2 * MAX_CATEGORIES_PER_LINE) {
        return (
          <div style={styles.twoRowsContainer}>
            <ComponentsList
              components={categoryIconsByAnnotation.slice(0, MAX_CATEGORIES_PER_LINE).map(renderCategoryIconWithCount)}
              spaceBetweenComponents={theme.spacing * 3}
            />
            <ComponentsList
              components={categoryIconsByAnnotation.slice(MAX_CATEGORIES_PER_LINE).map(renderCategoryIconWithCount)}
              spaceBetweenComponents={theme.spacing * 3}
            />
          </div>
        );
      }
      const slicedSecondRow = categoryIconsByAnnotation
        .slice(MAX_CATEGORIES_PER_LINE, 2 * MAX_CATEGORIES_PER_LINE - 1)
        .map(renderCategoryIconWithCount);
      const lastIcon = (
        <div style={styles.categoryContainer}>
          <div style={styles.categoryIconContainer}>
            <Icon iconName="moreHoriz" />
          </div>
          <div>
            <Text>
              {sumBy(
                categoryIconsByAnnotation.slice(2 * MAX_CATEGORIES_PER_LINE - 1),
                ({ entitiesCount }) => entitiesCount,
              )}
            </Text>
          </div>
        </div>
      );
      return (
        <div style={styles.twoRowsContainer}>
          <ComponentsList
            components={categoryIconsByAnnotation.slice(0, MAX_CATEGORIES_PER_LINE).map(renderCategoryIconWithCount)}
            spaceBetweenComponents={theme.spacing * 3}
          />
          <ComponentsList components={[...slicedSecondRow, lastIcon]} spaceBetweenComponents={theme.spacing * 3} />
        </div>
      );
    }

    function renderCategoryIconWithCount({ entitiesCount, category }: { entitiesCount: number; category: string }) {
      return (
        <div style={styles.categoryContainer}>
          <div style={styles.categoryIconContainer}>
            <CategoryIcon category={category} iconSize={CATEGORY_ICON_SIZE} settings={props.settings} />
          </div>
          <div>
            <Text>{entitiesCount} </Text>
          </div>
        </div>
      );
    }

    async function onSelect() {
      setIsSelecting(true);
      try {
        await props.onSelect(props.choice);
      } finally {
        setIsSelecting(false);
      }
    }
  }
}

function computeCategoryIconNamesByEntitiesCount(annotations: annotationType[], availableCategories: string[]) {
  return orderBy(
    Object.entries(groupBy(annotations, (annotation) => annotation.category))
      .map(([category, grouppedAnnotations]) => ({
        entitiesCount: Object.keys(groupBy(grouppedAnnotations, (annotation) => annotation.entityId)).length,
        category,
      }))
      .filter(({ category }) => availableCategories.includes(category)),
    'entitiesCount',
    'desc',
  );
}

function buildStyles(theme: customThemeType) {
  return {
    publishedDocumentCardContainer: {
      backgroundColor: theme.colors.primary.background,
      borderRadius: theme.shape.borderRadius.m,
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing,
    },
    publishedDocumentTitleContainer: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing * 2,
      paddingBottom: theme.spacing * 2,
      paddingTop: theme.spacing,
    },
    publishedDocumentTitle: {
      paddingLeft: theme.spacing * 2,
    },
    publicationCategoryLetter: {
      marginLeft: theme.spacing,
    },
    card: {
      borderRadius: theme.shape.borderRadius.m,
      padding: theme.spacing * 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: theme.boxShadow.major.out,
      width: `${CARD_WIDTH}px`,
      backgroundColor: theme.colors.background,
    },
    categoryIconsContainer: {
      display: 'flex',
      flex: 1,
      marginBottom: theme.spacing * 4,
      minHeight: ICONS_CONTAINER_HEIGHT,
    },
    twoRowsContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    categoryContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: theme.spacing,
    },
    categoryIconContainer: {
      marginBottom: theme.spacing,
    },
    title: {
      marginBottom: theme.spacing * 4,
    },
    specificDocumentInfoEntryTable: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      marginBottom: theme.spacing * 3,
    },
    genericDocumentInfoEntryTable: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      marginBottom: theme.spacing * 5,
    },
    documentInfoEntryRow: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
    },
    documentLabelContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end',
      paddingRight: theme.spacing,
    },
    documentValueContainer: {
      flex: 1,
      paddingLeft: theme.spacing,
    },
    documentLabelText: {
      textAlign: 'right',
    },
  } as const;
}
