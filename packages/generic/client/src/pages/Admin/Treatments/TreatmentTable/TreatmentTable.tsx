import React from 'react';
import { makeStyles } from '@material-ui/core';
import { treatmentType } from '@label/core';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Text } from '../../../../components';
import { wordings } from '../../../../wordings';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { timeOperator } from './utils';

export { TreatmentTable };

function TreatmentTable(props: { treatments: treatmentType[] }) {
  const theme = useCustomTheme();
  const borderTableCellClasses = getBorderTableCellClasses(theme);
  const durations = props.treatments.map(({ duration }) => duration);
  return (
    <Table isHeaderSticky>
      <TableHead>
        <TableRow>
          <TableCell classes={borderTableCellClasses.bottom}>
            <Text variant="h3">{wordings.treatmentsPage.table.columnTitles.number}</Text>
          </TableCell>
          <TableCell classes={borderTableCellClasses.bottom}>
            <Text variant="h3">{wordings.treatmentsPage.table.columnTitles.duration}</Text>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.treatments.map((treatment) => (
          <TableRow>
            <TableCell classes={borderTableCellClasses.none}>
              <Text variant="h3">{treatment._id}</Text>
            </TableCell>
            <TableCell classes={borderTableCellClasses.none}>
              <Text variant="h3">{timeOperator.convertDurationToReadableDuration(treatment.duration)}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter isSticky>
        <TableRow>
          <TableCell classes={borderTableCellClasses.top}>
            <Text variant="h3" color="textSecondary">
              {wordings.treatmentsPage.table.footer.total}
            </Text>
            <Text variant="h3">{wordings.treatmentsPage.table.footer.average}</Text>
          </TableCell>
          <TableCell classes={borderTableCellClasses.top}>
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

function getBorderTableCellClasses(theme: customThemeType) {
  const top = makeStyles({
    root: {
      borderTop: `1px solid ${theme.colors.line.level2}`,
      borderBottom: 'none',
    },
  })();
  const bottom = makeStyles({
    root: {
      borderBottom: `1px solid ${theme.colors.line.level2}`,
    },
  })();
  const none = makeStyles({
    root: {
      border: `none`,
    },
  })();
  return { top, bottom, none };
}
