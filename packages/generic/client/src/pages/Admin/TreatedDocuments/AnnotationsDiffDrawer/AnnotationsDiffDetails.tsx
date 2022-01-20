import React from 'react';
import { annotationType, apiRouteOutType, settingsModule, settingsType } from '@label/core';
import { customThemeType, useCustomTheme, getColor, useDisplayMode, Text } from 'pelta-design-system';

export { AnnotationsDiffDetails };

function AnnotationsDiffDetails(props: {
  annotationsDiffDetails: apiRouteOutType<'get', 'annotationsDiffDetails'>;
  settings: settingsType;
}) {
  const theme = useCustomTheme();
  const { displayMode } = useDisplayMode();
  const styles = buildStyles(theme);

  const sortedAnnotationsDiffDetails = mapAnnotationsDiffDetails(props.annotationsDiffDetails);
  return (
    <div style={styles.container}>
      {sortedAnnotationsDiffDetails.map(({ text, annotationAfter, annotationBefore, textStart }) => {
        return (
          <div style={styles.annotationsDiffDetail}>
            <div style={styles.annotationsDiffDetailBefore}>
              {renderAnnotationDiffDetail(text, textStart, annotationBefore)}
            </div>
            <div>{renderAnnotationDiffDetail(text, textStart, annotationAfter)}</div>
          </div>
        );
      })}
    </div>
  );

  function renderAnnotationDiffDetail(text: string, textStart: number, annotation: annotationType | undefined) {
    if (!annotation) {
      return <Text variant="body2">{text}</Text>;
    }
    const textBefore = annotation.start - textStart > 0 ? text.substring(0, annotation.start - textStart) : '';
    const textAfter =
      textStart + text.length - (annotation.start + annotation.text.length) > 0
        ? text.substring(annotation.start - textStart + annotation.text.length)
        : '';
    const categoryColor = getColor(
      settingsModule.lib.getAnnotationCategoryColor(annotation.category, props.settings, displayMode),
    );
    const annotationContainerStyle = buildAnnotationContainerStyle(theme, categoryColor);
    return (
      <div>
        <Text variant="body2">{textBefore}</Text>
        <Text variant="body2" style={annotationContainerStyle}>
          {annotation.text}
        </Text>
        <Text variant="body2">{textAfter}</Text>
      </div>
    );
  }
}

function buildAnnotationContainerStyle(theme: customThemeType, categoryColor: string) {
  return {
    backgroundColor: categoryColor,
    padding: '0px 2px',
    borderRadius: theme.shape.borderRadius.xxxs,
  };
}

function mapAnnotationsDiffDetails(annotationsDiffDetails: apiRouteOutType<'get', 'annotationsDiffDetails'>) {
  const mappedAnnotationsDiffDetails = [
    ...annotationsDiffDetails.addedAnnotations.map(({ text, textStart, addedAnnotation }) => ({
      text,
      textStart,
      annotationBefore: undefined,
      annotationAfter: addedAnnotation,
    })),
    ...annotationsDiffDetails.deletedAnnotations.map(({ text, textStart, deletedAnnotation }) => ({
      text,
      textStart,
      annotationBefore: deletedAnnotation,
      annotationAfter: undefined,
    })),
    ...annotationsDiffDetails.categoryChangedAnnotations,
    ...annotationsDiffDetails.resizedBiggerAnnotations,
    ...annotationsDiffDetails.resizedSmallerAnnotations,
  ];

  return mappedAnnotationsDiffDetails.sort(
    ({ textStart: textStartA }, { textStart: textStartB }) => textStartA - textStartB,
  );
}

function buildStyles(theme: customThemeType) {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.colors.document,
      width: '100%',
      padding: `${theme.spacing * 3}px 0px`,
      borderRadius: theme.shape.borderRadius.m,
    },
    annotationsDiffDetail: {
      padding: `0px ${theme.spacing * 3}px`,
      display: 'flex',
      flexDirection: 'column',
      marginBottom: theme.spacing * 2,
    },
    annotationsDiffDetailBefore: {
      opacity: 0.5,
    },
  } as const;
}
