import React from 'react';
import { useCustomTheme } from '../../../styles';
import { ICON_B, ICON_O, ICON_P, ICON_R } from './icons';

export { PublicationCategoryBadge };

const BADGE_SIZE = 24;

function PublicationCategoryBadge(props: { publicationCategoryLetter: string }) {
  const theme = useCustomTheme();
  return (
    <svg
      width={BADGE_SIZE}
      height={BADGE_SIZE}
      viewBox={`0 0 ${BADGE_SIZE} ${BADGE_SIZE}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={getIcon(props.publicationCategoryLetter)}
        fill={theme.colors.badge.type1.backgroundColor}
      />
    </svg>
  );
}

function getIcon(publicationCategoryLetter: string) {
  switch (publicationCategoryLetter) {
    case 'B':
      return ICON_B;
    case 'P':
      return ICON_P;
    case 'R':
      return ICON_R;
    default:
      return ICON_O;
  }
}
