import React from 'react';
import { TreatmentsDataFetcher } from './TreatmentsDataFetcher';

export { Treatments };

function Treatments() {
  return (
    <TreatmentsDataFetcher>
      {({ treatments }) => (
        <table>
          {treatments.map((treatment) => (
            <tr>
              <td>{treatment._id}</td>
              <td>{treatment.documentId}</td>
              <td>{treatment.duration}</td>
              <td>{treatment.order}</td>
            </tr>
          ))}
        </table>
      )}
    </TreatmentsDataFetcher>
  );
}
