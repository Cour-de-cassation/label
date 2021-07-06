import React from 'react';
import { customThemeType, useCustomTheme } from '../../../styles';
import { Text } from '../../generic';

export { PublicationCategoryBadge };

function PublicationCategoryBadge(props: { publicationCategoryLetter: string }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <div style={styles.container}>
      <div style={styles.leftRectangle}>
        <Text>{props.publicationCategoryLetter}</Text>
      </div>
      <div style={styles.rightRectangle}>
        <div style={styles.rightTopRectangle}></div>
        <div style={styles.rightBottomRectangle}></div>
      </div>
    </div>
  );
}

function buildStyles(theme: customThemeType) {
  const TOTAL_WIDTH = 16;
  const TOTAL_HEIGHT = 20;
  const LEFT_RECTANGLE_WIDTH = 9;
  const RIGHT_BOTTOM_RECTANGLE_WIDTH = 13;
  return {
    container: {
      width: TOTAL_WIDTH,
      height: TOTAL_HEIGHT,
      display: 'flex',
    },
    leftRectangle: {
      width: LEFT_RECTANGLE_WIDTH,
      height: TOTAL_HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      color: theme.colors.badge.type1.color,
      backgroundColor: theme.colors.badge.type1.backgroundColor,
      borderTopLeftRadius: theme.shape.borderRadius.xxxs,
      borderBottomLeftRadius: theme.shape.borderRadius.xxxs,
    },
    rightRectangle: {
      display: 'flex',
      flexDirection: 'column',
    },
    rightTopRectangle: {
      height: 0,
      width: 0,
      borderRight: `8px solid transparent`,
      borderBottom: `8px solid ${theme.colors.badge.type1.backgroundColor}`,
    },
    rightBottomRectangle: {
      height: RIGHT_BOTTOM_RECTANGLE_WIDTH,
      width: TOTAL_WIDTH - LEFT_RECTANGLE_WIDTH,
      backgroundColor: theme.colors.badge.type1.backgroundColor,
      borderBottomRightRadius: theme.shape.borderRadius.xxxs,
    },
  } as const;
}
