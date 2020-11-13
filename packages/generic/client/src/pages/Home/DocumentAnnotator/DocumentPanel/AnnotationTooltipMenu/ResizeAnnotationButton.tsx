import React, { ReactElement } from 'react';
import { IconButton } from '../../../../../components';
import { wordings } from '../../../../../wordings';

export { ResizeAnnotationButton };

function ResizeAnnotationButton(props: { onClick: () => void; disabled: boolean }): ReactElement {
  return (
    <IconButton
      color="default"
      hint={wordings.resize}
      iconName="resize"
      disabled={props.disabled}
      onClick={props.onClick}
    />
  );
}
