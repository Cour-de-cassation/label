import React, { ReactElement } from 'react';
import { Theme, useTheme } from '@material-ui/core';
import { annotationType, settingsType } from '@label/core';
import { Button } from '../../../../components';
import { getAnnotationCategoryColor } from '../../../../styles';

export { DocumentAnnotationText };

function DocumentAnnotationText(props: {
  annotation: annotationType;
  annotationDisplayedText: string;
  settings: settingsType;
}): ReactElement {
  const theme = useTheme();
  const style = buildStyle(theme);

  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <Button onClick={() => {}} style={style.annotationText}>
      {props.annotationDisplayedText}
    </Button>
  );

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
