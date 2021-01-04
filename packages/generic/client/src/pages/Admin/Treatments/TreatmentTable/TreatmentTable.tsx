import React from 'react';
import { treatmentType } from '@label/core';
import { heights } from '../../../../styles';

export { TreatmentTable };

function TreatmentTable(props: { treatments: treatmentType[] }) {
  return (
    <table>
      {props.treatments.map((treatment) => (
        <tr>
          <td>{treatment.duration}</td>
          <td>{treatment._id}</td>
          <td>{treatment.documentId}</td>
          <td>{treatment.order}</td>
        </tr>
      ))}
    </table>
  );
}
