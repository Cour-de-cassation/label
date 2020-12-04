import React, { ReactElement } from 'react';
import { annotationHandler, fetchedAnnotationType, settingsModule } from '@label/core';
import { CategoryIcon, Header, Text } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { clientAnonymizerType } from '../../../../../types';
import { wordings } from '../../../../../wordings';
import { customThemeType, useCustomTheme } from '../../../../../styles';

export { AnnotationTooltipMenuHeader };

function AnnotationTooltipMenuHeader(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  anonymizer: clientAnonymizerType;
  isAnonymizedView: boolean;
}): ReactElement {
  const theme = useCustomTheme();
  const style = buildStyle(theme);
  const annotatorState = props.annotatorStateHandler.get();
  const annotationIndex = annotationHandler.getAnnotationIndex(annotatorState.annotations, props.annotation);

  return (
    <>
      <Header
        leftHeaderComponents={[
          <CategoryIcon category={props.annotation.category} iconSize={40} settings={annotatorState.settings} />,
          <Text inline>
            {settingsModule.lib.getAnnotationCategoryText(
              props.annotation.category,
              props.annotatorStateHandler.get().settings,
            )}
          </Text>,
        ]}
        rightHeaderComponents={[<Text>{`${annotationIndex.index}/${annotationIndex.total}`}</Text>]}
        spaceBetweenComponents={theme.spacing}
        style={style.header}
        variant="mainLeft"
      />
      <Text variant="body1">
        {`${props.isAnonymizedView ? wordings.originalText : wordings.pseudonymisation} : `}
        <Text inline variant="body2">
          {props.isAnonymizedView ? props.annotation.text : props.anonymizer.anonymize(props.annotation)}
        </Text>
      </Text>
    </>
  );

  function buildStyle(theme: customThemeType) {
    return {
      header: {
        paddingBottom: `${theme.spacing * 2}px`,
      },
    };
  }
}
