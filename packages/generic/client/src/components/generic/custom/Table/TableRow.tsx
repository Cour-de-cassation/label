import React, { CSSProperties, useState } from 'react';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { Icon, Text } from '../../materialUI';
import { OptionButton } from './OptionButton';
import { optionItemType, tableRowFieldType } from './Table';

export { TableRow };

const ROW_DEFAULT_HEIGHT = 50;

function TableRow<InputT>(props: {
  fields: Array<tableRowFieldType<InputT>>;
  row: InputT;
  isHighlighted: boolean;
  onRowClick?: () => void;
  optionItems?: Array<optionItemType<InputT>>;
  optionCellStyle?: CSSProperties;
}) {
  const theme = useCustomTheme();
  const [isHovered, setIsHovered] = useState(false);
  const styles = buildStyles(theme);
  const cellWeight = props.isHighlighted ? 'bold' : 'normal';
  const formattedRow = props.fields.map((field) =>
    field.render ? field.render(props.row) : <Text variant="h3">{field.extractor(props.row)}</Text>,
  );
  const { onRowClick } = props;

  return (
    <>
      <tr
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={!!onRowClick ? onRowClick : undefined}
        style={styles.row}
      >
        {Object.values(formattedRow).map((value) => (
          <td>
            <Text weight={cellWeight} variant="h3">
              {value}
            </Text>
          </td>
        ))}
        <td style={props.optionCellStyle}>{renderOptionButton()}</td>
      </tr>
    </>
  );

  function renderOptionButton() {
    const { optionItems } = props;

    if (!optionItems || !isHovered) {
      return null;
    }
    const items = optionItems.map((optionItem) => ({
      text: optionItem.text,
      value: optionItem.text,
      icon: optionItem.iconName ? <Icon iconName={optionItem.iconName} /> : undefined,
    }));
    const onSelect = (optionItemText: string) => {
      const optionItem = optionItems.find(({ text }) => text === optionItemText);
      optionItem && optionItem.onClick(props.row);
    };
    return <OptionButton items={items} onClose={() => setIsHovered(false)} onSelect={onSelect} />;
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
