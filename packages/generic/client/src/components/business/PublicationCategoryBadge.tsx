import React from 'react';
import { customThemeType, useCustomTheme } from '../../styles';
import { Text } from '../generic';

export { PublicationCategoryBadge };

const BADGE_SIZE = 24;

function PublicationCategoryBadge(props: { publicationCategoryLetter: string }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <div style={styles.badge}>
      <Text variant="h3" style={styles.badgeText}>
        {props.publicationCategoryLetter}
      </Text>
    </div>
  );
}

function buildStyles(theme: customThemeType) {
  return {
    badge: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: BADGE_SIZE,
      height: BADGE_SIZE,
      borderRadius: BADGE_SIZE / 2,
      backgroundColor: theme.colors.badge.type1.backgroundColor,
      color: theme.colors.badge.type1.color,
    },
    badgeText: {
      paddingTop: '4px',
    },
  };
}
