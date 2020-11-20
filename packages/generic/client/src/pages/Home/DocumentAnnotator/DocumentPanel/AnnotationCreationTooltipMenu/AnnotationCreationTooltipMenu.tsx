import React, { ReactElement, useState, CSSProperties } from 'react';
import { annotationModule, annotationTextDetector, settingsModule } from '@label/core';
import { Checkbox, LabelledDropdown, LayoutGrid, Text, TooltipMenu } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';
import { customThemeType, useCustomTheme } from '../../../../../styles';

export { AnnotationCreationTooltipMenu };

function AnnotationCreationTooltipMenu(props: {
  anchorText: Element;
  annotatorStateHandler: annotatorStateHandlerType;
  annotationText: string;
  annotationIndex: number;
  onClose: () => void;
}): ReactElement {
  const [shouldApplyEverywhere, setShouldApplyEverywhere] = useState(true);
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const annotatorState = props.annotatorStateHandler.get();
  const categories = settingsModule.lib.getCategories(annotatorState.settings);
  const annotationTextsAndIndices = annotationTextDetector.detectAnnotationTextsAndIndices(
    annotatorState.document.text,
    props.annotationText,
    annotatorState.annotations,
  );
  return (
    <TooltipMenu anchorElement={props.anchorText} onClose={props.onClose}>
      <LayoutGrid container direction="column" alignItems="center">
        <LayoutGrid item style={styles.annotationTextContainer}>
          <Text variant="body2" style={styles.annotationText}>
            {props.annotationText}
          </Text>
        </LayoutGrid>
        <LayoutGrid item style={styles.identicalOccurrencesContainer}>
          <Text variant="h3">
            <span style={styles.identicalOccurrencesNumber}>{annotationTextsAndIndices.length}</span>{' '}
            {wordings.identicalOccurrencesSpotted}
          </Text>
        </LayoutGrid>
        <LayoutGrid item container>
          <Checkbox
            defaultChecked={shouldApplyEverywhere}
            onChange={(checked: boolean) => setShouldApplyEverywhere(checked)}
            text={wordings.applyEveryWhere}
          ></Checkbox>
        </LayoutGrid>
        <LayoutGrid item container>
          <LabelledDropdown
            items={categories.map((category) => ({
              value: category,
              displayedText: settingsModule.lib.getAnnotationCategoryText(category, annotatorState.settings),
            }))}
            label={wordings.category}
            onChange={applyAnnotationCreation}
          />
        </LayoutGrid>
      </LayoutGrid>
    </TooltipMenu>
  );

  function applyAnnotationCreation(category: string) {
    const newAnnotations = createAnnotations(category);

    props.annotatorStateHandler.set({
      ...annotatorState,
      annotations: [...newAnnotations, ...annotatorState.annotations],
    });

    props.onClose();
  }

  function createAnnotations(category: string) {
    if (shouldApplyEverywhere) {
      return annotationModule.lib.fetchedAnnotationHandler.createAll(category, annotationTextsAndIndices);
    } else {
      return [
        annotationModule.lib.fetchedAnnotationHandler.create(category, props.annotationIndex, props.annotationText),
      ];
    }
  }
  function buildStyles(theme: customThemeType): { [cssClass: string]: CSSProperties } {
    return {
      annotationTextContainer: {
        marginBottom: theme.spacing * 2,
      },
      annotationText: {
        backgroundColor: theme.colors.default.hoveredBackground,
        color: theme.colors.default.hoveredTextColor,
        padding: '2px 4px',
        borderRadius: '3px',
      },
      identicalOccurrencesContainer: {
        marginBottom: theme.spacing * 4,
      },
      identicalOccurrencesNumber: {
        fontWeight: 'bold',
      },
    };
  }
}
