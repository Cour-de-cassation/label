import React, { CSSProperties } from 'react';
import { groupBy, orderBy } from 'lodash';
import { annotationType, fetchedDocumentType, settingsType } from '@label/core';
import { customThemeType, useCustomTheme } from '../../../styles';
import { ButtonWithIcon, CategoryIcon, ComponentsList, Text } from '../../../components';
import { wordings } from '../../../wordings';
import { computeDocumentInfoEntries } from './computeDocumentInfoEntries';

export { DocumentSelectorCard };

const DOCUMENT_INFO_ENTRIES = ['annotations', 'linkedEntities', 'entities'] as const;
const MAX_WIDTH = 400;
const CATEGORY_ICON_SIZE = 32;
const MAX_CATEGORIES_SHOWN = 8;

function DocumentSelectorCard(props: {
  choice: { annotations: annotationType[]; document: fetchedDocumentType };
  onSelect: (choice: { document: fetchedDocumentType; annotations: annotationType[] }) => void;
  settings: settingsType;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const documentInfoEntries = computeDocumentInfoEntries(props.choice.annotations);
  const categoryIconsByAnnotation = computeCategoryIconNamesByEntitiesCount(props.choice.annotations);

  return (
    <div style={styles.card}>
      <Text style={styles.title} variant="h1">
        {wordings.homePage.wholeCheck}
      </Text>
      <Text style={styles.subtitle} variant="h2">
        {props.choice.document.title}
      </Text>
      <div style={styles.documentInfoEntryTable}>
        {DOCUMENT_INFO_ENTRIES.map((documentInfoEntry) => (
          <div key={documentInfoEntry} style={styles.documentInfoEntryRow}>
            <div style={styles.documentLabelContainer}>
              <Text style={styles.documentLabelText}>{wordings.homePage.documentInfoEntries[documentInfoEntry]}</Text>
            </div>
            <div style={styles.documentValueContainer}>
              <Text variant="h2">{documentInfoEntries[documentInfoEntry]}</Text>
            </div>
          </div>
        ))}
      </div>
      <div style={styles.categoryIconsContainer}>
        <ComponentsList
          components={categoryIconsByAnnotation.map(({ category, entitiesCount }) => (
            <div style={styles.categoryContainer}>
              <div style={styles.categoryIconContainer}>
                <CategoryIcon category={category} iconSize={CATEGORY_ICON_SIZE} settings={props.settings} />
              </div>
              <div>
                <Text>{entitiesCount} </Text>
              </div>
            </div>
          ))}
          spaceBetweenComponents={theme.spacing * 3}
        />
      </div>
      <ButtonWithIcon
        iconName="clock"
        color="primary"
        onClick={() => props.onSelect(props.choice)}
        text={wordings.homePage.start}
      />
    </div>
  );

  function computeCategoryIconNamesByEntitiesCount(annotations: annotationType[]) {
    return orderBy(
      Object.entries(groupBy(annotations, (annotation) => annotation.category)).map(
        ([category, grouppedAnnotations]) => ({
          entitiesCount: Object.keys(groupBy(grouppedAnnotations, (annotation) => annotation.entityId)).length,
          category,
        }),
      ),
      'entitiesCount',
      'desc',
    ).slice(0, MAX_CATEGORIES_SHOWN);
  }
}

function buildStyles(theme: customThemeType): { [cssClass: string]: CSSProperties } {
  return {
    card: {
      borderRadius: theme.shape.borderRadius.m,
      padding: theme.spacing * 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: theme.boxShadow.major.out,
      maxWidth: `${MAX_WIDTH}px`,
    },
    categoryIconsContainer: {
      display: 'flex',
      flex: 1,
      marginBottom: theme.spacing * 7,
    },
    categoryContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    categoryIconContainer: {
      marginBottom: theme.spacing,
    },
    title: {
      marginBottom: theme.spacing,
    },
    subtitle: {
      marginBottom: theme.spacing * 3,
    },
    documentInfoEntryTable: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      marginBottom: theme.spacing * 7,
    },
    documentInfoEntryRow: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
    },
    documentLabelContainer: {
      flex: 1,
      paddingRight: theme.spacing,
    },
    documentValueContainer: {
      flex: 1,
      paddingLeft: theme.spacing,
    },
    documentLabelText: {
      textAlign: 'right',
    },
  };
}
