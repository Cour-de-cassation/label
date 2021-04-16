import React from 'react';
import { useCustomTheme } from '../../../styles';

export { PublicationCategoryBadge };

const BADGE_SIZE = 24;
const ICON =
  'M0.01 2C0.01 0.9 0.9 0 2 0H9.17C9.7 0 10.21 0.21 10.58 0.59L15.41 5.42C15.79 5.79 16 6.3 16 6.83V18C16 19.1 15.1 20 14 20H1.99C0.89 20 0 19.1 0 18L0.01 2ZM9 1.5V6C9 6.55 9.45 7 10 7H14.5L9 1.5Z';

function PublicationCategoryBadge(props: { publicationCategoryLetter: string }) {
  const theme = useCustomTheme();
  return (
    <svg width={BADGE_SIZE} height={BADGE_SIZE} viewBox={`0 0 ${BADGE_SIZE} ${BADGE_SIZE}`} fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={ICON}
        fill={theme.colors.badge.type1.backgroundColor}
        mask="url(#knockout-text)"
      />
      <mask id="knockout-text">
        <rect width={BADGE_SIZE} height={BADGE_SIZE} fill="#fff" />
        <text x="1" y="18" fill="#000" fontSize="13px">
          {props.publicationCategoryLetter}
        </text>
      </mask>
    </svg>
  );
}
