import React, { ReactElement, useState, CSSProperties } from 'react';
import { annotationHandler, annotationTextDetector, settingsModule } from '@label/core';
import {
  CategoryIcon,
  Checkbox,
  CircleIcon,
  FloatingTooltipMenu,
  LabelledDropdown,
  LayoutGrid,
  Text,
} from '../../../../../components';
import { useAnnotatorStateHandler } from '../../../../../services/annotatorState';
import { useMonitoring } from '../../../../../services/monitoring';
import { customThemeType, useCustomTheme } from '../../../../../styles';
import { positionType } from '../../../../../types';
import { wordings } from '../../../../../wordings';

export { AnnotationCreationTooltipMenu };

const TOOLTIP_MENU_MAX_WIDTH = 300;
const CATEGORY_ICON_SIZE = 30;

function AnnotationCreationTooltipMenu(props: {
  annotationText: string;
  annotationIndex: number;
  onClose: () => void;
  originPosition: positionType;
}): ReactElement {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const { addMonitoringEntry } = useMonitoring();
  const [shouldApplyEverywhere, setShouldApplyEverywhere] = useState(true);
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const annotatorState = annotatorStateHandler.get();
  const categories = settingsModule.lib.getCategories(annotatorState.settings);
  const annotationTextsAndIndices = annotationTextDetector.detectAnnotationTextsAndIndices({
    documentText: annotatorState.document.text,
    annotationIndex: props.annotationIndex,
    annotationText: props.annotationText,
    annotations: annotatorState.annotations,
  });

  return (
    <FloatingTooltipMenu
      shouldCloseWhenClickedAway
      originPosition={props.originPosition}
      onClose={props.onClose}
      width={TOOLTIP_MENU_MAX_WIDTH}
    >
      <div style={styles.tooltipMenuContent}>
        <LayoutGrid item style={styles.annotationTextContainer}>
          <Text variant="body2" style={styles.annotationText}>
            {props.annotationText}
          </Text>
        </LayoutGrid>
        <LayoutGrid item style={styles.identicalOccurrencesContainer}>
          <Text variant="h3">
            <span style={styles.identicalOccurrencesNumber}>{annotationTextsAndIndices.length}</span>{' '}
            {wordings.homePage.identicalOccurrencesSpotted}
          </Text>
        </LayoutGrid>
        <LayoutGrid item container>
          <Checkbox
            defaultChecked={shouldApplyEverywhere}
            onChange={(checked: boolean) => setShouldApplyEverywhere(checked)}
            text={wordings.homePage.applyEveryWhere}
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
        </LayoutGrid>
      </div>
    </FloatingTooltipMenu>
  );

  function applyAnnotationCreation(category: string) {
    addMonitoringEntry({
      description: `tooltip_create_${shouldApplyEverywhere ? 'all' : 'one'}_${category}`,
      type: 'button',
    });
    const newAnnotations = shouldApplyEverywhere
      ? annotationHandler.createAll(annotatorState.annotations, category, annotationTextsAndIndices)
      : annotationHandler.create(annotatorState.annotations, {
          category,
          start: props.annotationIndex,
          text: props.annotationText,
        });

    annotatorStateHandler.set({
      ...annotatorState,
      annotations: newAnnotations,
    });

    props.onClose();
  }

  function buildStyles(theme: customThemeType): { [cssClass: string]: CSSProperties } {
    const MAX_DISPLAYED_LINES = 3;
    const ANNOTATION_TEXT_LINE_HEIGHT = 15;
    return {
      tooltipMenuContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
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
      identicalOccurrencesContainer: {
        marginBottom: theme.spacing * 4,
      },
      identicalOccurrencesNumber: {
        fontWeight: 'bold',
      },
    };
  }
}
