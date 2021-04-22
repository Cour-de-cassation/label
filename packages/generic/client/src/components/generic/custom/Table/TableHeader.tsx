import React, { CSSProperties } from 'react';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { TableSortLabel, Text, Tooltip } from '../../materialUI';

export { TableHeader, DEFAULT_ORDER_DIRECTION };

export type { orderDirectionType };

type orderDirectionType = 'asc' | 'desc';

const DEFAULT_ORDER_DIRECTION = 'asc';

type cellType<orderByPropertyT> = {
  id: orderByPropertyT;
  title: string;
  tooltipText?: string;
  canBeSorted?: boolean;
};

function TableHeader<orderByPropertyT extends string = string>(props: {
  cells: Array<cellType<orderByPropertyT>>;
  fieldCellStyles: Record<string, CSSProperties>;
  optionCellStyle?: CSSProperties;
  orderByProperty: orderByPropertyT | undefined;
  orderDirection: orderDirectionType;
  setOrderDirection: (orderDirection: orderDirectionType) => void;
  setOrderByProperty: (orderByProperty: orderByPropertyT) => void;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <thead>
      <tr style={styles.header}>
        {props.cells.map((cell) => (
          <td style={props.fieldCellStyles[cell.id]}>
            {cell.canBeSorted ? (
              <TableSortLabel
                direction={props.orderDirection}
                active={props.orderByProperty === cell.id}
                onClick={onOrderByPropertyClickBuilder(cell.id)}
              >
                {renderCellTitle(cell)}
              </TableSortLabel>
            ) : (
              renderCellTitle(cell)
            )}
          </td>
        ))}
        {!!props.optionCellStyle && <td style={props.optionCellStyle} />}
      </tr>
    </thead>
  );

  function onOrderByPropertyClickBuilder(newOrderByProperty: orderByPropertyT) {
    const onOrderByPropertyClick = () => {
      if (newOrderByProperty === props.orderByProperty) {
        props.setOrderDirection(props.orderDirection === 'asc' ? 'desc' : 'asc');
      } else {
        props.setOrderDirection(DEFAULT_ORDER_DIRECTION);
        props.setOrderByProperty(newOrderByProperty);
      }
    };
    return onOrderByPropertyClick;
  }

  function renderCellTitle(cell: cellType<orderByPropertyT>) {
    if (cell.tooltipText) {
      return (
        <Tooltip title={cell.tooltipText}>
          <Text variant="h3">{cell.title}</Text>
        </Tooltip>
      );
    }
    return <Text variant="h3">{cell.title}</Text>;
  }
}

function buildStyles(theme: customThemeType) {
  return {
    header: {
      top: 0,
      position: 'sticky',
      backgroundColor: theme.colors.background,
    },
  } as const;
}
