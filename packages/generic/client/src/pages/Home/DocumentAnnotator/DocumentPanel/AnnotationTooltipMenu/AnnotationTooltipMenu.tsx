import React, { ReactElement } from 'react';
import { fetchedAnnotationType } from '@label/core';
import { ComponentsList, LayoutGrid, LinkAnnotationDropdown, TooltipMenu } from '../../../../../components';
import { customThemeType, useCustomTheme } from '../../../../../styles';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { clientAnonymizerType } from '../../../../../types';
import { AnnotationTooltipMenuHeader } from './AnnotationTooltipMenuHeader';
import { ChangeAnnotationCategoryDropdown } from './ChangeAnnotationCategoryDropdown';
import { DeleteAnnotationDropdown } from './DeleteAnnotationDropdown';
import { UnlinkAnnotationDropdown } from './UnlinkAnnotationDropdown';

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
              />,
              <UnlinkAnnotationDropdown
                annotatorStateHandler={props.annotatorStateHandler}
                annotation={props.annotation}
              />,
              <DeleteAnnotationDropdown
                annotatorStateHandler={props.annotatorStateHandler}
                annotation={props.annotation}
                onClose={props.onClose}
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
