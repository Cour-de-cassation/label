import React, { ReactElement, useState } from 'react';
import { useTheme, Theme } from '@material-ui/core';
import { uniq } from 'lodash';
import { anonymizerType, annotationModule, fetchedAnnotationType, idModule, settingsModule } from '@label/core';
import {
  Checkbox,
  CategoryDropdown,
  CategoryIcon,
  Header,
  LayoutGrid,
  Text,
  TooltipMenu,
} from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { buildComponentList } from '../../../../../utils';
import { wordings } from '../../../../../wordings';
import { AnnotationTooltipMenuLinkerSection } from './AnnotationTooltipMenuLinkerSection';
import { DeleteAnnotationButton } from './DeleteAnnotationButton';
import { ResizeAnnotationButton } from './ResizeAnnotationButton';
import { UnlinkAnnotationButton } from './UnlinkAnnotationButton';

export { AnnotationTooltipMenu };

const ANNOTATION_TOOLTIP_MENU_WIDTH = 300;

function AnnotationTooltipMenu(props: {
  anchorAnnotation: Element | undefined;
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
  isAnonymizedView: boolean;
  onClose: () => void;
}): ReactElement {
  const theme = useTheme();
  const style = buildStyle(theme);
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
          <Header
            leftHeaderComponents={[
              <CategoryIcon
                annotatorStateHandler={props.annotatorStateHandler}
                category={props.annotation.category}
                iconSize={40}
              />,
              <Text inline>
                {settingsModule.lib.getAnnotationCategoryText(
                  props.annotation.category,
                  props.annotatorStateHandler.get().settings,
                )}
              </Text>,
            ]}
            rightHeaderComponents={[<Text>{`${annotationIndex.index}/${annotationIndex.total}`}</Text>]}
            spaceBetweenComponents={theme.spacing()}
            variant="mainLeft"
          />
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
        <LayoutGrid container style={style.tooltipItem}>
          {buildComponentList(
            [
              <UnlinkAnnotationButton
                annotatorStateHandler={props.annotatorStateHandler}
                annotation={props.annotation}
                disabled={!shouldApplyEverywhere}
              />,
              <ResizeAnnotationButton />,
              <DeleteAnnotationButton
                annotatorStateHandler={props.annotatorStateHandler}
                annotation={props.annotation}
                onClick={props.onClose}
                shouldApplyEverywhere={shouldApplyEverywhere}
              />,
            ],
            theme.spacing(),
          )}
        </LayoutGrid>
      </LayoutGrid>
    </TooltipMenu>
  );

  function buildStyle(theme: Theme) {
    return {
      tooltipItem: {
        maxWidth: ANNOTATION_TOOLTIP_MENU_WIDTH,
        padding: `${theme.spacing()}px 0px`,
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
}
