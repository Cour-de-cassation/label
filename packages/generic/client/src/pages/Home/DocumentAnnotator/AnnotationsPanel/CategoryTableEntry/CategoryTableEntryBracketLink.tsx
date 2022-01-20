import React, { CSSProperties } from 'react';
import { customThemeType, useCustomTheme } from 'pelta-design-system';

export { CategoryTableEntryBracketLink };

function CategoryTableEntryBracketLink(props: { color: string; variant: 'first' | 'middle' | 'empty' | 'last' }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <div style={styles.container as CSSProperties}>
      <div style={{ ...styles.base, ...computeLinkUpperPart() }} />
      <div style={{ ...styles.base, ...computeLinkLowerPart() }} />
    </div>
  );

  function computeLinkLowerPart() {
    switch (props.variant) {
      case 'first':
        return styles.bracketStart;
      case 'middle':
        return styles.bracketStart;
      case 'last':
        return styles.bracketNone;
      case 'empty':
        return styles.bracketNone;
    }
  }
  function computeLinkUpperPart() {
    switch (props.variant) {
      case 'first':
        return styles.bracketNone;
      case 'middle':
        return styles.bracketEnd;
      case 'last':
        return styles.bracketEnd;
      case 'empty':
        return styles.bracketNone;
    }
  }

  function buildStyles(theme: customThemeType) {
    return {
      container: { display: 'flex', flexDirection: 'column' },
      base: {
        color: props.color,
        marginRight: theme.spacing,
        width: theme.spacing,
      },
      bracketStart: {
        borderRadius: '6px 0 0 0',
        alignSelf: 'flex-end',
        borderLeft: '2px solid',
        borderTop: '2px solid',
        marginTop: '-2px',
        flex: 0.6,
      },
      bracketEnd: {
        borderRadius: ' 0 0 0 6px',
        borderWidth: '1px !important',
        alignSelf: 'flex-start',
        borderLeft: '2px solid',
        borderBottom: '2px solid',
        flex: 0.4,
      },
      bracketNone: {
        flex: 0.5,
      },
    };
  }
}
