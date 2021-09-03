import React from 'react';
import format from 'string-template';
import { documentType } from '@label/core';
import { useCustomTheme } from '../../styles';
import { wordings } from '../../wordings';
import { CircleIcon, iconNameType } from '../generic';

export { DocumentReviewStatusIcon };

const documentReviewStatusIconNameMapping: Record<'viewed' | 'amended', iconNameType> = {
  viewed: 'eye',
  amended: 'edit',
};

function DocumentReviewStatusIcon(props: { iconSize: number; reviewStatus: documentType['reviewStatus'] }) {
  const theme = useCustomTheme();
  const iconName = documentReviewStatusIconNameMapping[props.reviewStatus.hasBeenAmended ? 'amended' : 'viewed'];
  const hint = computeHint(props.reviewStatus);

  return (
    <CircleIcon
      hint={hint}
      iconName={iconName}
      iconSize={props.iconSize}
      backgroundColor={theme.colors.default.background}
    />
  );
}
function computeHint(reviewStatus: documentType['reviewStatus']) {
  if (reviewStatus.hasBeenAmended) {
    return wordings.business.documentReviewFilterStatus.amended.iconTooltip;
  }
  return format(wordings.business.documentReviewFilterStatus.viewed.iconTooltip, {
    viewerNames: reviewStatus.viewerNames.join(', '),
  });
}
