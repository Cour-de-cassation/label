import React, { CSSProperties } from 'react';
import { fetchedAnnotationType, fetchedDocumentType } from '@label/core';
import { customThemeType, useCustomTheme } from '../../../styles';
import { ButtonWithIcon, Text } from '../../../components';
import { wordings } from '../../../wordings';

export { DocumentSelectorCard };

function DocumentSelectorCard(props: {
  document: fetchedDocumentType;
  annotations: fetchedAnnotationType[];
  onSelect: () => void;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <div style={styles.card}>
      <Text style={styles.title} variant="h1">
        {wordings.wholeCheck}
      </Text>
      <Text style={styles.subtitle} variant="h2">
        {props.document.title}
      </Text>
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
  };
}
