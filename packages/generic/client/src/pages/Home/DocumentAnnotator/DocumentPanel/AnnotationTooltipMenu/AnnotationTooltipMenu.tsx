import React, { ReactElement, useState } from 'react';
import { fetchedAnnotationType } from '@label/core';
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
import { clientAnonymizerType } from '../../../../../types';
import { wordings } from '../../../../../wordings';
import { AnnotationTooltipMenuHeader } from './AnnotationTooltipMenuHeader';
import { ChangeAnnotationCategoryDropdown } from './ChangeAnnotationCategoryDropdown';

export { AnnotationTooltipMenu };

const ANNOTATION_TOOLTIP_MENU_WIDTH = 300;

function AnnotationTooltipMenu(props: {
  anchorAnnotation: Element | undefined;
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  anonymizer: clientAnonymizerType;
  isAnonymizedView: boolean;
  onClose: () => void;
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
              />,
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

  function buildStyle(theme: customThemeType) {
    return {
      tooltipItem: {
        maxWidth: ANNOTATION_TOOLTIP_MENU_WIDTH,
        padding: `${theme.spacing}px 0px`,
      },
    };
  }
}
