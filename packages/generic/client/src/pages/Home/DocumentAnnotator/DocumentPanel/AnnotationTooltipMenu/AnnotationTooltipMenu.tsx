import React, { ReactElement, useState } from 'react';
import { anonymizerType, fetchedAnnotationType } from '@label/core';
import {
  Checkbox,
  ComponentsList,
  DeleteAnnotationButton,
  LayoutGrid,
  LinkAnnotationDropdown,
  TooltipMenu,
  UnlinkAnnotationButton,
} from '../../../../../components';
import { customThemeType, useCustomTheme } from '../../../../../styles';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';
import { AnnotationTooltipMenuHeader } from './AnnotationTooltipMenuHeader';
import { ChangeAnnotationCategoryDropdown } from './ChangeAnnotationCategoryDropdown';
import { ResizeAnnotationButton } from './ResizeAnnotationButton';
import { headerModeType } from '../DocumentPanelHeader';

export { AnnotationTooltipMenu };

const ANNOTATION_TOOLTIP_MENU_WIDTH = 300;

function AnnotationTooltipMenu(props: {
  anchorAnnotation: Element | undefined;
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
  isAnonymizedView: boolean;
  onClose: () => void;
  setHeaderMode: (headerMode: headerModeType) => void;
}): ReactElement {
  const theme = useCustomTheme();
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
              <ChangeAnnotationCategoryDropdown
                annotatorStateHandler={props.annotatorStateHandler}
                annotation={props.annotation}
                shouldApplyEverywhere={shouldApplyEverywhere}
              />,
              <ResizeAnnotationButton onClick={onResizeAnnotationClick} />,
              <LinkAnnotationDropdown
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
            spaceBetweenComponents={theme.spacing}
          />
        </LayoutGrid>
      </LayoutGrid>
    </TooltipMenu>
  );

  function onResizeAnnotationClick() {
    props.setHeaderMode('resize');
    props.onClose();
  }

  function buildStyle(theme: customThemeType) {
    return {
      tooltipItem: {
        maxWidth: ANNOTATION_TOOLTIP_MENU_WIDTH,
        padding: `${theme.spacing}px 0px`,
      },
    };
  }
}
