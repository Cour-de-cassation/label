import React, { ReactElement, useState } from 'react';
import { uniq } from 'lodash';
import { anonymizerType, annotationModule, fetchedAnnotationType, idModule, settingsModule } from '@label/core';
import {
  ButtonWithIcon,
  Checkbox,
  CategoryDropdown,
  CategoryIcon,
  LayoutGrid,
  Text,
  TooltipMenu,
} from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';
import { AnnotationTooltipMenuLinkerSection } from './AnnotationTooltipMenuLinkerSection';

export { AnnotationTooltipMenu };

const ANNOTATION_TOOLTIP_MENU_WIDTH = 280;

function AnnotationTooltipMenu(props: {
  anchorAnnotation: Element | undefined;
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
  isAnonymizedView: boolean;
  onClose: () => void;
}): ReactElement {
  const style = buildStyle();
  const [shouldApplyEverywhere, setShouldApplyEverywhere] = useState(true);
  const annotatorState = props.annotatorStateHandler.get();
  const categories = uniq(annotatorState.annotations.map((annotation) => annotation.category));
  const annotationIndex = annotationModule.lib.fetchedAnnotationHandler.getAnnotationIndex(
    props.annotation,
    annotatorState.annotations,
  );

  return (
    <TooltipMenu anchorElement={props.anchorAnnotation} onClose={props.onClose}>
      <LayoutGrid>
        <LayoutGrid container alignItems="center" style={style.tooltipItem}>
          <LayoutGrid>
            <CategoryIcon
              annotatorStateHandler={props.annotatorStateHandler}
              category={props.annotation.category}
              iconSize={30}
            />
          </LayoutGrid>
          <LayoutGrid>
            <Text style={style.categoryText}>
              {settingsModule.lib.getAnnotationCategoryText(
                props.annotation.category,
                props.annotatorStateHandler.get().settings,
              )}
            </Text>
          </LayoutGrid>
          <LayoutGrid>
            <Text style={style.categoryText}>{`${annotationIndex.index}/${annotationIndex.total}`}</Text>
          </LayoutGrid>
        </LayoutGrid>
        <LayoutGrid style={style.tooltipItem}>
          <Text variant="body1">
            {`${props.isAnonymizedView ? wordings.originalText : wordings.pseudonymisation} : `}
            <Text inline variant="body2">
              {props.isAnonymizedView ? props.annotation.text : props.anonymizer.anonymize(props.annotation)}
            </Text>
          </Text>
        </LayoutGrid>
        <LayoutGrid style={style.tooltipItem}>
          <Checkbox
            defaultChecked={shouldApplyEverywhere}
            onChange={(checked: boolean) => setShouldApplyEverywhere(checked)}
            text={wordings.applyEveryWhere}
          ></Checkbox>
        </LayoutGrid>
        <LayoutGrid style={style.tooltipItem}>
          <CategoryDropdown
            annotatorStateHandler={props.annotatorStateHandler}
            categories={categories}
            defaultCategory={props.annotation.category}
            onChange={changeAnnotationCategory}
            width={ANNOTATION_TOOLTIP_MENU_WIDTH}
          />
        </LayoutGrid>
        <AnnotationTooltipMenuLinkerSection
          annotatorStateHandler={props.annotatorStateHandler}
          annotation={props.annotation}
          disabled={!shouldApplyEverywhere}
          linkerCommandStyle={style.tooltipItem}
          width={ANNOTATION_TOOLTIP_MENU_WIDTH}
        />
        <LayoutGrid style={style.tooltipItem}>
          <ButtonWithIcon
            color="secondary"
            iconName="delete"
            onClick={deleteAnnotation}
            style={style.deleteButton}
            text={wordings.delete}
          />
        </LayoutGrid>
      </LayoutGrid>
    </TooltipMenu>
  );

  function buildStyle() {
    return {
      categoryText: {
        marginLeft: '12px',
      },
      deleteButton: {
        width: ANNOTATION_TOOLTIP_MENU_WIDTH,
      },
      tooltipItem: {
        maxWidth: ANNOTATION_TOOLTIP_MENU_WIDTH,
        padding: '4px 0px',
      },
    };
  }

  function changeAnnotationCategory(newCategory: string) {
    const newAnnotations = annotationModule.lib.fetchedAnnotationHandler.updateMany(
      annotatorState.annotations,
      shouldApplyEverywhere
        ? (annotation) => annotation.entityId === props.annotation.entityId
        : (annotation) => idModule.lib.equalId(annotation._id, props.annotation._id),
      (annotation) => ({
        ...annotation,
        category: newCategory,
      }),
    );

    const newAnnotatorState = { ...annotatorState, annotations: newAnnotations };
    props.annotatorStateHandler.set(newAnnotatorState);
  }

  function deleteAnnotation() {
    props.onClose();

    const newAnnotations = annotatorState.annotations.filter((annotation) =>
      shouldApplyEverywhere
        ? annotation.entityId !== props.annotation.entityId
        : !idModule.lib.equalId(annotation._id, props.annotation._id),
    );

    const newAnnotatorState = { ...annotatorState, annotations: newAnnotations };
    props.annotatorStateHandler.set(newAnnotatorState);
  }
}
