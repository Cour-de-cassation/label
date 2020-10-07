import React, { ReactElement } from 'react';
import { documentType } from '@label/core';

export { DocumentViewer };

function DocumentViewer(props: { document: documentType }): ReactElement {
  return (
    <table>
      {props.document.text.split('\r').map((row, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            {row.split('\t').map((tabulatedText, index) => (
              <span key={index}>&ensp;{tabulatedText}</span>
            ))}
          </td>
        </tr>
      ))}
    </table>
  );
}
