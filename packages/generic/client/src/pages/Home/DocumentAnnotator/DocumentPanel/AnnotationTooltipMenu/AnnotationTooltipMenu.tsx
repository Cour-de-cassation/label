import React, { ReactElement, useState } from 'react';
import { useTheme, Theme } from '@material-ui/core';
import { anonymizerType, fetchedAnnotationType } from '@label/core';
import { Checkbox, ComponentsList, LayoutGrid, TooltipMenu } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';
import { AnnotationTooltipMenuHeader } from './AnnotationTooltipMenuHeader';
import { ChangeAnnotationCategoryButton } from './ChangeAnnotationCategoryButton';
import { DeleteAnnotationButton } from './DeleteAnnotationButton';
import { LinkAnnotationButton } from './LinkAnnotationButton';
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

  return (
    <TooltipMenu anchorElement={props.anchorAnnotation} onClose={props.onClose}>
      <LayoutGrid>
        <LayoutGrid container alignItems="center" style={style.tooltipItem}>
          <AnnotationTooltipMenuHeader
            annotatorStateHandler={props.annotatorStateHandler}
            annotation={props.annotation}
            anonymizer={props.anonymizer}
            isAnonymizedView={props.isAnonymizedView}
          />
        </LayoutGrid>
        <LayoutGrid style={style.tooltipItem}>
          <Checkbox
            defaultChecked={shouldApplyEverywhere}
            onChange={(checked: boolean) => setShouldApplyEverywhere(checked)}
            text={wordings.applyEveryWhere}
          ></Checkbox>
        </LayoutGrid>
        <LayoutGrid container style={style.tooltipItem}>
          <ComponentsList
            components={[
              <ChangeAnnotationCategoryButton
                annotatorStateHandler={props.annotatorStateHandler}
                annotation={props.annotation}
                shouldApplyEverywhere={shouldApplyEverywhere}
              />,
              <ResizeAnnotationButton />,
              <LinkAnnotationButton
                annotatorStateHandler={props.annotatorStateHandler}
                annotation={props.annotation}
                disabled={!shouldApplyEverywhere}
              />,
              <UnlinkAnnotationButton
                annotatorStateHandler={props.annotatorStateHandler}
                annotation={props.annotation}
                disabled={!shouldApplyEverywhere}
              />,
              <DeleteAnnotationButton
                annotatorStateHandler={props.annotatorStateHandler}
                annotation={props.annotation}
                onClick={props.onClose}
                shouldApplyEverywhere={shouldApplyEverywhere}
              />,
            ]}
            spaceBetweenComponents={theme.spacing()}
          />
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
}
