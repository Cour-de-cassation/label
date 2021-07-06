import React from 'react';
import { customThemeType, useCustomTheme } from '../../../styles';
import { Text } from '../../generic';

export { PublicationCategoryBadge };

const BADGE_WIDTH = 20;
const BADGE_HEIGHT = 30;
const TRIANGLE_SIZE = 10;

function PublicationCategoryBadge(props: { publicationCategoryLetter: string }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <div style={styles.rectangle}>
      <div style={styles.triangle} />
      <Text>{props.publicationCategoryLetter}</Text>
    </div>
  );
}

function buildStyles(theme: customThemeType) {
  return {
    rectangle: {
      position: 'relative',
      width: BADGE_WIDTH,
      height: BADGE_HEIGHT,
      backgroundColor: theme.colors.badge.type1.backgroundColor,
      color: theme.colors.badge.type1.color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.borderRadius.xxxs,
    },
    triangle: {
      position: 'absolute',
      zIndex: 100,
      top: 0,
      right: 0,
      borderTopRightRadius: theme.shape.borderRadius.xxxs,
      borderLeft: `${TRIANGLE_SIZE}px solid transparent`,
      borderTop: `${TRIANGLE_SIZE}px solid ${theme.colors.line.level2}`,
    },
  } as const;
}
