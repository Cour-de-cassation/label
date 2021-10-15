import React, { CSSProperties, useState } from 'react';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { Icon, Text } from '../../materialUI';
import { OptionButton } from './OptionButton';
import { optionItemType, tableRowFieldType } from './Table';
import { TableOptionItemSelectionPopUp } from './TableOptionItemSelectionPopUp';

export { TableRow };

const ROW_DEFAULT_HEIGHT = 50;

type optionItemSelectionType = {
  items: Array<string>;
  description: string;
  dropdownLabel: string;
  onSelect: (item: string) => void;
};

function TableRow<InputT>(props: {
  fields: Array<tableRowFieldType<InputT>>;
  row: InputT;
  isHighlighted: boolean;
  isMinored: boolean;
  onRowClick?: () => void;
  buildOptionItems?: (data: InputT) => Array<optionItemType>;
  optionCellStyle?: CSSProperties;
}) {
  const theme = useCustomTheme();
  const [optionItemSelection, setOptionItemSelection] = useState<optionItemSelectionType | undefined>();
  const [isHovered, setIsHovered] = useState(false);
  const styles = buildStyles(theme);
  const cellWeight = props.isHighlighted ? 'bold' : 'normal';
  const cellColor = props.isMinored ? 'textSecondary' : 'textPrimary';
  const formattedRow = props.fields.map((field) => ({
    style: field.cellStyle,
    content: field.render ? field.render(props.row) : <Text variant="h3">{field.extractor(props.row)}</Text>,
  }));
  const { onRowClick } = props;

  return (
    <>
      {!!optionItemSelection && (
        <TableOptionItemSelectionPopUp
          dropdownLabel={optionItemSelection.dropdownLabel}
          description={optionItemSelection.description}
          items={optionItemSelection.items}
          onSelect={optionItemSelection.onSelect}
          onClose={() => setOptionItemSelection(undefined)}
        />
      )}
      <tr
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={!!onRowClick ? onRowClick : undefined}
        style={styles.row}
      >
        {formattedRow.map(({ content, style }) => (
          <td style={style}>
            <Text weight={cellWeight} color={cellColor} variant="h3">
              {content}
            </Text>
          </td>
        ))}
        <td style={props.optionCellStyle}>{renderOptionButton()}</td>
      </tr>
    </>
  );

  function renderOptionButton() {
    const { buildOptionItems } = props;

    if (!buildOptionItems || !isHovered) {
      return null;
    }
    const optionItems = buildOptionItems(props.row);
    if (optionItems.length === 0) {
      return null;
    }
    const items = optionItems.map((optionItem) => ({
      text: optionItem.text,
      value: optionItem.text,
      isDisabled: optionItem.isDisabled,
      icon: optionItem.iconName ? <Icon iconName={optionItem.iconName} /> : undefined,
    }));
    const onSelect = (optionItemText: string) => {
      const optionItem = optionItems.find(({ text }) => text === optionItemText);
      if (!optionItem) {
        return;
      }
      switch (optionItem.kind) {
        case 'text':
          optionItem.onClick();
          return;
        case 'selection':
          setOptionItemSelection({
            description: optionItem.description,
            items: optionItem.items,
            dropdownLabel: optionItem.dropdownLabel,
            onSelect: buildOptionItemOnSelect(optionItem.onSelect),
          });
          return;
      }
    };
    return <OptionButton items={items} onClose={() => setIsHovered(false)} onSelect={onSelect} />;
  }

  function buildOptionItemOnSelect(onSelect: (text: string) => Promise<void>) {
    return async (text: string) => {
      await onSelect(text);
      setOptionItemSelection(undefined);
    };
  }

  function buildStyles(theme: customThemeType) {
    const cursor = !!props.onRowClick ? 'pointer' : 'default';
    const backgroundColor = isHovered ? theme.colors.default.background : undefined;
    return {
      row: {
        cursor,
        backgroundColor,
        height: `${ROW_DEFAULT_HEIGHT}px`,
      },
    };
  }
}
