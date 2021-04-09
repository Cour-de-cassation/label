import React, { ReactElement } from 'react';
import { customThemeType, useCustomTheme } from '../../../../styles';

export { TableFooter };

export type { footerCellType };

type footerCellType = {
  id: string;
  content: ReactElement;
};

function TableFooter(props: { cells: Array<footerCellType> }) {
  const theme = useCustomTheme();
  const footerStyles = buildStyles(theme);
  return (
    <tfoot>
      <tr style={footerStyles.footer}>
        {props.cells.map((cell) => (
          <td key={cell.id}>{cell.content}</td>
        ))}
      </tr>
    </tfoot>
  );
}

function buildStyles(theme: customThemeType) {
  return {
    footer: {
      borderTop: `1px solid ${theme.colors.line.level2}`,
    },
  };
}
