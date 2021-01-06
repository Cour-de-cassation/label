import React from 'react';
import { treatmentType } from '@label/core';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Text } from '../../../../components';
import { wordings } from '../../../../wordings';
import { timeOperator } from './utils';

export { TreatmentTable };

function TreatmentTable(props: { treatments: treatmentType[] }) {
  const durations = props.treatments.map(({ duration }) => duration);

  return (
    <Table isHeaderSticky>
      <TableHead>
        <TableRow>
          <TableCell>
            <Text variant="h3">{wordings.treatmentsPage.table.columnTitles.number}</Text>
          </TableCell>
          <TableCell>
            <Text variant="h3">{wordings.treatmentsPage.table.columnTitles.duration}</Text>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.treatments.map((treatment) => (
          <TableRow>
            <TableCell>
              <Text variant="h3">{treatment._id}</Text>
            </TableCell>
            <TableCell>
              <Text variant="h3">{timeOperator.convertDurationToReadableDuration(treatment.duration)}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter isSticky>
        <TableRow>
          <TableCell>
            <Text variant="h3" color="textSecondary">
              {wordings.treatmentsPage.table.footer.total}
            </Text>
            <Text variant="h3">{wordings.treatmentsPage.table.footer.average}</Text>
          </TableCell>
          <TableCell>
            <Text variant="h3" color="textSecondary">
              {timeOperator.getReadableTotalDuration(durations)}
            </Text>
            <Text variant="h3">{timeOperator.getReadableAverageDuration(durations)}</Text>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
