import React, { ReactElement, useState, useEffect } from 'react';
import {
  customThemeType,
  useCustomTheme,
  Checkbox,
  CircleIcon,
  FloatingTooltipMenu,
  LabelledDropdown,
  Text,
  positionType,
} from 'pelta-design-system';
import { annotationHandler, annotationTextDetector, settingsModule } from '@label/core';
import { CategoryIcon } from '../../../../../components';
import { useAnnotatorStateHandler } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';
import { textSelectionType } from '../DocumentText';

export { AnnotationCreationTooltipMenu };

const CATEGORY_ICON_SIZE = 30;
const ANNOTATION_TEXT_MAX_LENGTH = 300;
const TOOLTIP_MENU_MIN_WIDTH = 300;
const TOOLTIP_MENU_MAX_WIDTH = 600;

function AnnotationCreationTooltipMenu(props: {
  textSelection: textSelectionType;
  onClose: () => void;
  originPosition: positionType;
}): ReactElement {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const annotatorState = annotatorStateHandler.get();
  const { settings } = annotatorState;
  const annotationTextsAndIndices = getAnnotationTextsAndIndices();
  const [shouldApplyEverywhere, setShouldApplyEverywhere] = useState(annotationTextsAndIndices.length > 1);
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const categories = settingsModule.lib.getCategories(settings, {
    status: ['annotable', 'visible'],
    canBeAnnotatedBy: 'human',
  });
  const annotationText = computeAnnotationText();

  const [tooltipWidth, setTooltipWidth] = useState(TOOLTIP_MENU_MIN_WIDTH);
  useEffect(() => {
    const textLength = annotationText.length;
    const newWidth = Math.min(TOOLTIP_MENU_MAX_WIDTH, Math.max(TOOLTIP_MENU_MIN_WIDTH, textLength * 4));
    setTooltipWidth(newWidth);
  }, [annotationText]);

  return (
    <FloatingTooltipMenu
      shouldCloseWhenClickedAway
      originPosition={props.originPosition}
      onClose={props.onClose}
      width={tooltipWidth}
    >
      <div style={styles.tooltipMenuContent}>
        <div style={styles.annotationTextContainer}>
          <Text variant="body2" style={styles.annotationText}>
            {annotationText}
          </Text>
        </div>
        {annotationTextsAndIndices.length > 1 && (
          <>
            <div style={styles.identicalOccurrencesContainer}>
              <Text variant="h3">
                <span style={styles.identicalOccurrencesNumber}>{annotationTextsAndIndices.length - 1}</span>{' '}
                {wordings.homePage.identicalOccurrencesSpotted}
              </Text>
            </div>
            <div style={styles.checkboxContainer}>
              <Checkbox
                defaultChecked={shouldApplyEverywhere}
                onChange={(checked: boolean) => setShouldApplyEverywhere(checked)}
                text={wordings.homePage.applyEveryWhere}
              ></Checkbox>
            </div>
          </>
        )}
        <div style={styles.categoryDropdownContainer}>
          <LabelledDropdown
            items={categories.map((category) => ({
              icon: (
                <CategoryIcon settings={annotatorState.settings} category={category} iconSize={CATEGORY_ICON_SIZE} />
              ),
              text: settingsModule.lib.getAnnotationCategoryText(category, annotatorState.settings),
              value: category,
            }))}
            label={wordings.homePage.category}
            labelIcon={
              <CircleIcon
                iconName="puzzle"
                iconSize={CATEGORY_ICON_SIZE}
                backgroundColor={theme.colors.disabled.color}
              />
            }
            onChange={applyAnnotationCreation}
          />
        </div>
      </div>
    </FloatingTooltipMenu>
  );

  function applyAnnotationCreation(category: string) {
    const newAnnotations = computeNewAnnotations(category);

    annotatorStateHandler.set({
      ...annotatorState,
      annotations: newAnnotations,
    });

    props.onClose();
  }

  function computeNewAnnotations(category: string) {
    if (shouldApplyEverywhere) {
      return annotationHandler.createAll(annotatorState.annotations, category, annotationTextsAndIndices, settings);
    }

    if (props.textSelection.length === 1) {
      return annotationHandler.create(
        annotatorState.annotations,
        {
          category,
          start: props.textSelection[0].index,
          text: props.textSelection[0].text,
        },
        settings,
      );
    }

    return annotationHandler.createManyLinked(
      annotatorState.annotations,
      props.textSelection.map(({ text, index }) => ({ category, text, start: index })),
    );
  }

  function computeAnnotationText() {
    const { text } = props.textSelection[0];
    if (text.length > ANNOTATION_TEXT_MAX_LENGTH) {
      return text.slice(0, ANNOTATION_TEXT_MAX_LENGTH / 2) + '\n[...]\n' + text.slice(-ANNOTATION_TEXT_MAX_LENGTH / 2);
    }
    return text;
  }

  function getAnnotationTextsAndIndices() {
    if (props.textSelection.length === 1) {
      return annotationTextDetector.detectAnnotationTextsAndIndices({
        documentText: annotatorState.document.text,
        annotationText: props.textSelection[0].text,
        annotations: annotatorState.annotations,
      });
    }
    return [];
  }

  function buildStyles(theme: customThemeType) {
    return {
      tooltipMenuContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      annotationTextContainer: {
        marginBottom: theme.spacing * 2,
      },
      annotationText: {
        backgroundColor: theme.colors.default.hoveredBackground,
        color: theme.colors.default.hoveredTextColor,
        padding: '2px 4px',
        borderRadius: '3px',
        whiteSpace: 'pre-wrap', // Preserve line breaks
      },
      checkboxContainer: {
        alignSelf: 'flex-start',
      },
      identicalOccurrencesContainer: {
        marginBottom: theme.spacing * 4,
      },
      identicalOccurrencesNumber: {
        fontWeight: 'bold',
      },
      categoryDropdownContainer: {
        display: 'flex',
        alignSelf: 'stretch',
      },
    } as const;
  }
}
