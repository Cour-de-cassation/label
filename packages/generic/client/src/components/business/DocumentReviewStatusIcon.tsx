import React from 'react';
import { useCustomTheme } from '../../styles';
import { wordings } from '../../wordings';
import { CircleIcon, iconNameType } from '../generic';

export { DocumentReviewStatusIcon };

const documentReviewStatusIconNameMapping: Record<'read' | 'amended', iconNameType> = {
  read: 'eye',
  amended: 'edit',
};

function DocumentReviewStatusIcon(props: { iconSize: number; reviewStatus: 'read' | 'amended' }) {
  const theme = useCustomTheme();
  const iconName = documentReviewStatusIconNameMapping[props.reviewStatus];

  return (
    <CircleIcon
      hint={wordings.business.documentReviewStatus[props.reviewStatus]}
      iconName={iconName}
      iconSize={props.iconSize}
      backgroundColor={theme.colors.default.background}
    />
  );
}
