import React from 'react';
import { Button, TooltipMenu, Text } from '../../../../components';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { rectPositionType } from '../../../../types';
import { wordings } from '../../../../wordings';

export { FilterTooltipMenu };

const WIDTH = 400;

function FilterTooltipMenu(props: { onClose: () => void; rectPosition: rectPositionType }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <TooltipMenu rectPosition={props.rectPosition} shouldCloseWhenClickedAway onClose={props.onClose} width={WIDTH}>
      <div style={styles.container}>
        <Button onClick={props.onClose} style={styles.button} color="primary">
          <Text variant="h2">{wordings.treatmentsPage.table.filter.apply}</Text>
        </Button>
      </div>
    </TooltipMenu>
  );

  function buildStyles(theme: customThemeType) {
    return {
      container: {
        display: 'flex',
        flexDirection: 'column',
      },
      button: {
        alignSelf: 'flex-end',
        padding: `${theme.spacing}px ${theme.spacing * 2}px`,
      },
    } as const;
  }
}
