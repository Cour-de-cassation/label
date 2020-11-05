import React, { ReactElement } from 'react';
import { IconButton } from '../../../../../components';
import { wordings } from '../../../../../wordings';

export { ResizeAnnotationButton };

function ResizeAnnotationButton(): ReactElement {
  return <IconButton color="default" hint={wordings.resize} iconName="arrowExpand" onClick={() => console.log} />;
}
