import React, { ReactElement } from 'react';
import { annotationHandler, annotationType, settingsModule } from '@label/core';
import { customThemeType, useCustomTheme, Header, Text } from 'pelta-design-system';
import { CategoryIcon } from '../../../../../components';
import { useAnnotatorStateHandler } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';
import { DocumentAnonymizedAnnotationText } from '../DocumentAnonymizedAnnotationText';

export { PureAnnotationTooltipMenuHeader as AnnotationTooltipMenuHeader };

type propsType = { annotation: annotationType; isAnonymizedView: boolean };

class PureAnnotationTooltipMenuHeader extends React.Component<propsType> {
  shouldComponentUpdate(nextProps: propsType) {
    return (
      nextProps.annotation.category !== this.props.annotation.category ||
      nextProps.annotation.entityId !== this.props.annotation.entityId ||
      nextProps.annotation.start !== this.props.annotation.start ||
      nextProps.annotation.text !== this.props.annotation.text ||
      nextProps.isAnonymizedView !== this.props.isAnonymizedView
    );
  }

  render() {
    return (
      <AnnotationTooltipMenuHeader annotation={this.props.annotation} isAnonymizedView={this.props.isAnonymizedView} />
    );
  }
}

function AnnotationTooltipMenuHeader(props: propsType): ReactElement {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const theme = useCustomTheme();
  const style = buildStyle(theme);
  const annotatorState = annotatorStateHandler.get();
  const annotationIndex = annotationHandler.getAnnotationIndex(annotatorState.annotations, props.annotation);

  return (
    <>
      <Header
        leftHeaderComponents={[
          <CategoryIcon category={props.annotation.category} iconSize={40} settings={annotatorState.settings} />,
          <Text inline>
            {settingsModule.lib.getAnnotationCategoryText(
              props.annotation.category,
              annotatorStateHandler.get().settings,
            )}
          </Text>,
        ]}
        rightHeaderComponents={[<Text>{`${annotationIndex.index}/${annotationIndex.total}`}</Text>]}
        spaceBetweenComponents={theme.spacing}
        style={style.header}
        variant="mainLeft"
      />
      <Text variant="body1">
        {`${!props.isAnonymizedView ? wordings.homePage.replacement : wordings.homePage.originalText} : `}
        <Text inline variant="body2">
          {!props.isAnonymizedView ? (
            <DocumentAnonymizedAnnotationText annotation={props.annotation} />
          ) : (
            props.annotation.text
          )}
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
