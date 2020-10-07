import React, { FunctionComponent } from 'react';
import { documentType } from '@label/core';

export { Document };

type propsType = {
  document: documentType;
};

const Document: FunctionComponent<propsType> = ({ document }: propsType) => {
  return (
    <table>
      {document.text.split('\r').map((row, index) => (
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
};
