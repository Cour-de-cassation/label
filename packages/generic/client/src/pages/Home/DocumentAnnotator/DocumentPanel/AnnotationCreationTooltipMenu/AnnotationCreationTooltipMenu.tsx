import React, { ReactElement, useState } from 'react';
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
import { useMonitoring } from '../../../../../services/monitoring';
import { wordings } from '../../../../../wordings';
import { textSelectionType } from '../DocumentText';

export { AnnotationCreationTooltipMenu };

const TOOLTIP_MENU_MAX_WIDTH = 300;
const CATEGORY_ICON_SIZE = 30;

function AnnotationCreationTooltipMenu(props: {
  textSelection: textSelectionType;
  onClose: () => void;
  originPosition: positionType;
}): ReactElement {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const annotatorState = annotatorStateHandler.get();
  const { settings } = annotatorState;
  const { addMonitoringEntry } = useMonitoring();
  const annotationTextsAndIndices = getAnnotationTextsAndIndices();
  const [shouldApplyEverywhere, setShouldApplyEverywhere] = useState(annotationTextsAndIndices.length > 1);
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const categories = settingsModule.lib.getCategories(settings, {
    status: ['annotable'],
    canBeAnnotatedBy: 'human',
  });
  const annotationText = computeAnnotationText();
  return (
    <FloatingTooltipMenu
      shouldCloseWhenClickedAway
      originPosition={props.originPosition}
      onClose={props.onClose}
      width={TOOLTIP_MENU_MAX_WIDTH}
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
    addMonitoringEntry({
      origin: 'document',
      action: `create_${shouldApplyEverywhere ? 'all' : 'one'}_category_${category}`,
    });
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
    if (props.textSelection.length === 1) {
      return props.textSelection[0].text;
    }
    return props.textSelection.map(({ text }) => text).join(' ');
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
    const MAX_DISPLAYED_LINES = 3;
    const ANNOTATION_TEXT_LINE_HEIGHT = 15;
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
        maxHeight: `${MAX_DISPLAYED_LINES * ANNOTATION_TEXT_LINE_HEIGHT}px`,
        WebkitLineClamp: MAX_DISPLAYED_LINES,
        lineHeight: `${ANNOTATION_TEXT_LINE_HEIGHT}px`,
        overflow: 'hidden',
        backgroundColor: theme.colors.default.hoveredBackground,
        color: theme.colors.default.hoveredTextColor,
        padding: '2px 4px',
        borderRadius: '3px',
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
