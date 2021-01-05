import React from 'react';
import { treatmentType } from '@label/core';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../../../components';
import { wordings } from '../../../../wordings';

export { TreatmentTable };

function TreatmentTable(props: { treatments: treatmentType[] }) {
  return (
    <Table isHeaderSticky>
      <TableHead>
        <TableRow>
          <TableCell>{wordings.treatmentsPage.table.columnTitles.number}</TableCell>
          <TableCell>{wordings.treatmentsPage.table.columnTitles.duration}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.treatments.map((treatment) => (
          <TableRow>
            <TableCell>{treatment._id}</TableCell>
            <TableCell>{treatment.duration}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
