import React from 'react';
import { DocumentsDoneDataFetcher } from './DocumentsDoneDataFetcher';

export { DocumentsDone };

function DocumentsDone() {
  return (
    <DocumentsDoneDataFetcher>
      {({ documentsDone }) => (
        <table>
          {documentsDone.map((document) => (
            <tr>
              <td>{document._id}</td>
              <td>{document.status}</td>
            </tr>
          ))}
        </table>
      )}
    </DocumentsDoneDataFetcher>
  );
}
