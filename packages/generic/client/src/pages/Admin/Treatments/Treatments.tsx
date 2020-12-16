import React from 'react';
import { MainHeader } from '../../../components';
import { wordings } from '../../../wordings';
import { TreatmentsDataFetcher } from './TreatmentsDataFetcher';

export { Treatments };

function Treatments() {
  return (
    <>
      <MainHeader title={wordings.treatmentsPage.title} subtitle={wordings.treatmentsPage.subtitle} />
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
    </>
  );
}
