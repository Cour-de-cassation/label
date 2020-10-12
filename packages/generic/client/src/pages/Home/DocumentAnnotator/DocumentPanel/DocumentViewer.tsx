import React, { ReactElement } from 'react';
import { Theme, useTheme } from '@material-ui/core';
import { documentType } from '@label/core';
import { Text } from '../../../../components';
import { heights } from '../../../../styles';

export { DocumentViewer };

function DocumentViewer(props: { document: documentType }): ReactElement {
  const theme = useTheme();
  const style = buildStyle(theme);
  return (
    <div style={style.container}>
      <table style={style.table}>
        <tbody>
          {props.document.text.split('\r').map((row, index) => (
            <tr key={index}>
              <td>
                <Text variant="body2">{index + 1}</Text>
              </td>
              <td>
                {row.split('\t').map((tabulatedText, index) => (
                  <span key={index}>
                    <Text variant="body2">&ensp;{tabulatedText}</Text>
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function buildStyle(theme: Theme) {
  return {
    container: {
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      overflowY: 'auto' as 'auto',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.common.black,
      height: heights.panel,
    },
    table: {
      padding: theme.spacing(2),
    },
  };
}
