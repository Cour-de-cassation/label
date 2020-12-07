import React, { ReactElement, useState, CSSProperties } from 'react';
import { annotationHandler, annotationModule, annotationTextDetector, settingsModule } from '@label/core';
import {
  ActionIcon,
  CategoryIcon,
  Checkbox,
  FloatingTooltipMenu,
  LabelledDropdown,
  LayoutGrid,
  Text,
} from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { customThemeType, useCustomTheme } from '../../../../../styles';
import { positionType } from '../../../../../types';
import { wordings } from '../../../../../wordings';

export { AnnotationCreationTooltipMenu };

const CATEGORY_ICON_SIZE = 30;

function AnnotationCreationTooltipMenu(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotationText: string;
  annotationIndex: number;
  onClose: () => void;
  originPosition: positionType;
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
    <FloatingTooltipMenu shouldCloseWhenClickedAway originPosition={props.originPosition} onClose={props.onClose}>
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
              icon: (
                <CategoryIcon settings={annotatorState.settings} category={category} iconSize={CATEGORY_ICON_SIZE} />
              ),
              text: settingsModule.lib.getAnnotationCategoryText(category, annotatorState.settings),
              value: category,
            }))}
            label={wordings.category}
            labelIcon={<ActionIcon iconName="puzzle" iconSize={CATEGORY_ICON_SIZE} />}
            onChange={applyAnnotationCreation}
          />
        </LayoutGrid>
      </LayoutGrid>
    </FloatingTooltipMenu>
  );

  function applyAnnotationCreation(category: string) {
    const newAnnotations = shouldApplyEverywhere
      ? annotationHandler.createAll(
          annotatorState.annotations,
          { category },
          annotationTextsAndIndices,
          annotationModule.lib.annotationBuilder.buildFetchedAnnotation,
        )
      : annotationHandler.create(
          annotatorState.annotations,
          { category, start: props.annotationIndex, text: props.annotationText },
          annotationModule.lib.annotationBuilder.buildFetchedAnnotation,
        );

    props.annotatorStateHandler.set({
      ...annotatorState,
      annotations: newAnnotations,
    });

    props.onClose();
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
