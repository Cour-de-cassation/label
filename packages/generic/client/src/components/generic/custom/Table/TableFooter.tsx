import React, { ReactElement } from 'react';
import { customThemeType, useCustomTheme } from '../../../../styles';

export { TableFooter };

export type { footerCellType };

type footerCellType = {
  id: string;
  content: ReactElement;
};

function TableFooter(props: { isSticky?: boolean; cells: Array<footerCellType> }) {
  const theme = useCustomTheme();
  const footerStyles = props.isSticky
    ? { ...buildFooterStyles(theme), ...buildFooterStickyStyle(theme) }
    : buildFooterStyles(theme);
  return (
    <tfoot>
      <tr style={footerStyles}>
        {props.cells.map((cell) => (
          <td key={cell.id}>{cell.content}</td>
        ))}
      </tr>
    </tfoot>
  );
}

function buildFooterStickyStyle(theme: customThemeType) {
  return {
    backgroundColor: theme.colors.background,
    bottom: 0,
    position: 'sticky',
  } as const;
}

function buildFooterStyles(theme: customThemeType) {
  return {
    borderTop: `1px solid ${theme.colors.line.level2}`,
  };
}
