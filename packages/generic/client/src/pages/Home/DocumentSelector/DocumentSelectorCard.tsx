import React, { CSSProperties } from 'react';
import { fetchedAnnotationType, fetchedDocumentType } from '@label/core';
import { customThemeType, useCustomTheme } from '../../../styles';
import { ButtonWithIcon, Text } from '../../../components';
import { wordings } from '../../../wordings';
import { computeDocumentInfoEntries } from './computeDocumentInfoEntries';

export { DocumentSelectorCard };

const DOCUMENT_INFO_ENTRIES = ['annotations', 'linkedEntities', 'entities'] as const;

function DocumentSelectorCard(props: {
  document: fetchedDocumentType;
  annotations: fetchedAnnotationType[];
  onSelect: () => void;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const documentInfoEntries = computeDocumentInfoEntries(props.annotations);

  return (
    <div style={styles.card}>
      <Text style={styles.title} variant="h1">
        {wordings.wholeCheck}
      </Text>
      <Text style={styles.subtitle} variant="h2">
        {props.document.title}
      </Text>
      <div style={styles.documentInfoEntryTable}>
        {DOCUMENT_INFO_ENTRIES.map((documentInfoEntry) => (
          <div key={documentInfoEntry} style={styles.documentInfoEntryRow}>
            <div style={styles.documentLabelContainer}>
              <Text style={styles.documentLabelText}>{wordings.documentInfoEntries[documentInfoEntry]}</Text>
            </div>
            <div style={styles.documentValueContainer}>
              <Text variant="h2">{documentInfoEntries[documentInfoEntry]}</Text>
            </div>
          </div>
        ))}
      </div>
      <ButtonWithIcon iconName="clock" color="primary" onClick={props.onSelect} text={wordings.start} />
    </div>
  );
}
function buildStyles(theme: customThemeType): { [cssClass: string]: CSSProperties } {
  return {
    card: {
      borderRadius: theme.shape.borderRadius.medium,
      padding: theme.spacing * 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: theme.boxShadow.major,
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
