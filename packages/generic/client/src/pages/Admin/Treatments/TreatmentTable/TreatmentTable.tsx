import React, { useState } from 'react';
import { get } from 'lodash';
import { makeStyles } from '@material-ui/core';
import { fetchedTreatmentType } from '@label/core';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  TableSortLabel,
  Text,
} from '../../../../components';
import { wordings } from '../../../../wordings';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { timeOperator } from './utils';

export { TreatmentTable };

type orderByPropertyType = '_id' | 'duration';

type orderDirectionType = 'asc' | 'desc';

const DEFAULT_ORDER_DIRECTION = 'asc';
const DEFAULT_ORDER_BY_PROPERTY = '_id';

function TreatmentTable(props: { treatments: fetchedTreatmentType[] }) {
  const theme = useCustomTheme();
  const [orderByProperty, setOrderByProperty] = useState<orderByPropertyType | undefined>(DEFAULT_ORDER_BY_PROPERTY);
  const [orderDirection, setOrderDirection] = useState<orderDirectionType>(DEFAULT_ORDER_DIRECTION);
  const borderTableCellClasses = getBorderTableCellClasses(theme);
  const sortedTreatments = getSortedTreatments(props.treatments);
  const durations = props.treatments.map(({ duration }) => duration);
  return (
    <Table isHeaderSticky>
      <TableHead>
        <TableRow>
          <TableCell classes={borderTableCellClasses.bottom}>
            <TableSortLabel
              direction={orderDirection}
              active={orderByProperty === '_id'}
              onClick={onOrderByPropertyClickBuilder('_id')}
            >
              <Text variant="h3">{wordings.treatmentsPage.table.columnTitles.number}</Text>
            </TableSortLabel>
          </TableCell>
          <TableCell classes={borderTableCellClasses.bottom}>
            <TableSortLabel
              direction={orderDirection}
              active={orderByProperty === 'duration'}
              onClick={onOrderByPropertyClickBuilder('duration')}
            >
              <Text variant="h3">{wordings.treatmentsPage.table.columnTitles.duration}</Text>
            </TableSortLabel>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedTreatments.map((treatment) => (
          <TableRow key={`${treatment._id}`}>
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

  function onOrderByPropertyClickBuilder(newOrderByProperty: orderByPropertyType) {
    const onOrderByPropertyClick = () => {
      if (newOrderByProperty === orderByProperty) {
        setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setOrderDirection(DEFAULT_ORDER_DIRECTION);
        setOrderByProperty(newOrderByProperty);
      }
    };
    return onOrderByPropertyClick;
  }
  function getSortedTreatments(treatments: fetchedTreatmentType[]) {
    if (!orderByProperty) {
      return treatments;
    }
    return treatments.sort((treatmentA, treatmentB) => {
      const propertyA = get(treatmentA, orderByProperty);
      const propertyB = get(treatmentB, orderByProperty);
      if (propertyA === propertyB) {
        return 0;
      } else if (propertyA < propertyB) {
        return orderDirection === 'asc' ? 1 : -1;
      } else {
        return orderDirection === 'asc' ? -1 : 1;
      }
    });
  }
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
