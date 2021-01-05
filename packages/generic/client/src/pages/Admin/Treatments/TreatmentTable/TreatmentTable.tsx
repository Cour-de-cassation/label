import React from 'react';
import { treatmentType } from '@label/core';
import { Table, TableBody, TableCell, TableHead, TableRow, Text } from '../../../../components';
import { wordings } from '../../../../wordings';
import { convertMillisecondsToReadableTime } from '../../../../utils';

export { TreatmentTable };

function TreatmentTable(props: { treatments: treatmentType[] }) {
  return (
    <Table isHeaderSticky>
      <TableHead>
        <TableRow>
          <TableCell>
            <Text>{wordings.treatmentsPage.table.columnTitles.number}</Text>
          </TableCell>
          <TableCell>
            <Text>{wordings.treatmentsPage.table.columnTitles.duration}</Text>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.treatments.map((treatment) => (
          <TableRow>
            <TableCell>
              <Text>{treatment._id}</Text>
            </TableCell>
            <TableCell>
              <Text>{convertMillisecondsToReadableTime(treatment.duration)}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
