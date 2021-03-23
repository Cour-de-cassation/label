import React, { CSSProperties } from 'react';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { TableSortLabel, Text, Tooltip } from '../../materialUI';

export { TableHeader, DEFAULT_ORDER_DIRECTION };

export type { orderDirectionType };

type orderDirectionType = 'asc' | 'desc';

const DEFAULT_ORDER_DIRECTION = 'asc';

type cellType = {
  id: string;
  title: string;
  tooltipText?: string;
  canBeSorted?: boolean;
};

function TableHeader(props: {
  cells: Array<cellType>;
  isSticky?: boolean;
  fieldCellStyles: Record<string, CSSProperties>;
  optionCellStyle?: CSSProperties;
  orderByProperty: string | undefined;
  orderDirection: orderDirectionType;
  setOrderDirection: (orderDirection: orderDirectionType) => void;
  setOrderByProperty: (orderByProperty: string) => void;
}) {
  const theme = useCustomTheme();
  const headerStyles = props.isSticky
    ? { ...buildHeaderStyles(theme), ...buildHeaderStickyStyle(theme) }
    : buildHeaderStyles(theme);
  return (
    <thead>
      <tr style={headerStyles}>
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

  function onOrderByPropertyClickBuilder(newOrderByProperty: string) {
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
}

function renderCellTitle(cell: cellType) {
  if (cell.tooltipText) {
    return (
      <Tooltip title={cell.tooltipText}>
        <Text variant="h3">{cell.title}</Text>
      </Tooltip>
    );
  }
  return <Text variant="h3">{cell.title}</Text>;
}

function buildHeaderStickyStyle(theme: customThemeType) {
  return {
    backgroundColor: theme.colors.background,
    top: 0,
    position: 'sticky',
  } as const;
}

function buildHeaderStyles(theme: customThemeType) {
  return {
    borderBottom: `1px solid ${theme.colors.line.level2}`,
  };
}
