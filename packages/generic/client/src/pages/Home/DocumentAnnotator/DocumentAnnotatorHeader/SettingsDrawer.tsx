import { Theme, useTheme } from '@material-ui/core';
import React from 'react';
import { Drawer, IconButton, LayoutGrid, Text } from '../../../../components';
import { wordings } from '../../../../wordings';

export { SettingsDrawer };

function SettingsDrawer(props: { close: () => void; isOpen: boolean }) {
  const theme = useTheme();
  const styles = buildStyles(theme);
  return (
    <Drawer onClose={props.close} isOpen={props.isOpen}>
      <LayoutGrid alignItems="center" justifyContent="space-between" container style={styles.drawer}>
        <LayoutGrid item>
          <Text variant="h1">{wordings.settings}</Text>
        </LayoutGrid>
        <LayoutGrid item>
          <IconButton hint={wordings.cancel} onClick={props.close} iconName="close" />
        </LayoutGrid>
      </LayoutGrid>
    </Drawer>
  );

  function buildStyles(theme: Theme) {
    return {
      drawer: {
        width: 600,
        padding: theme.spacing(5),
      },
    };
  }
}
