import React, { ReactElement, useState, MouseEvent } from 'react';
import { Theme, useTheme } from '@material-ui/core';
import { annotationType, settingsType } from '@label/core';
import { Button } from '../../../../components';
import { getAnnotationCategoryColor } from '../../../../styles';
import { AnnotationTooltipMenu } from './AnnotationTooltipMenu';

export { DocumentAnnotationText };

function DocumentAnnotationText(props: {
  annotation: annotationType;
  annotationDisplayedText: string;
  settings: settingsType;
}): ReactElement {
  const theme = useTheme();
  const style = buildStyle(theme);
  const [anchorAnnotation, setAnchorAnnotation] = useState<Element | undefined>(undefined);

  return (
    <span>
      <Button onClick={openTooltipMenu} style={style.annotationText}>
        {props.annotationDisplayedText}
      </Button>
      <AnnotationTooltipMenu
        anchorAnnotation={anchorAnnotation}
        annotation={props.annotation}
        open={isOpened()}
        onClose={closeTooltipMenu}
      />
    </span>
  );

  function isOpened() {
    return !!anchorAnnotation;
  }

  function openTooltipMenu(event: MouseEvent<Element>) {
    setAnchorAnnotation(event.currentTarget);
  }

  function closeTooltipMenu() {
    setAnchorAnnotation(undefined);
  }

  function buildStyle(theme: Theme) {
    return {
      annotationText: {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: getAnnotationCategoryColor(props.annotation.category, props.settings),
        padding: '0px 5px',
      },
    };
  }
}
