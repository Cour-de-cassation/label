import React from 'react';
import { MainHeader } from '../../../components';
import { heights } from '../../../styles';
import { wordings } from '../../../wordings';
import { TreatmentsDataFetcher } from './TreatmentsDataFetcher';

export { Treatments };

function Treatments() {
  const styles = buildStyles();
  return (
    <>
      <div style={styles.header}>
        <MainHeader title={wordings.treatmentsPage.title} subtitle={wordings.treatmentsPage.subtitle} />
      </div>
      <div style={styles.panel}>
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
      </div>
    </>
  );

  function buildStyles() {
    return {
      header: {
        height: heights.header,
      },
      panel: {
        overflowY: 'auto',
        height: heights.adminPanel,
      },
    } as const;
  }
}
