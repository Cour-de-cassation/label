import React, { ReactElement } from 'react';
import { Theme, useTheme } from '@material-ui/core';
import { documentType } from '@label/core';
import { Text } from '../../../../components';

export { DocumentViewer };

function DocumentViewer(props: { document: documentType }): ReactElement {
  const theme = useTheme();
  const style = buildStyle(theme);
  return (
    <div style={style}>
      <table>
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
    height: '80vh',
    overflow: 'scroll',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.black,
  };
}
