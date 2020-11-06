import { Theme, useTheme } from '@material-ui/core';
import React from 'react';
import { Drawer, IconButton, LayoutGrid, RadioButton, Text } from '../../../../components';
import { wordings } from '../../../../wordings';
import { useDisplayMode } from '../../../../styles';

export { SettingsDrawer };

function SettingsDrawer(props: { close: () => void; isOpen: boolean }) {
  const theme = useTheme();
  const { displayMode, setDisplayMode } = useDisplayMode();

  const styles = buildStyles(theme);

  return (
    <Drawer onClose={props.close} isOpen={props.isOpen}>
      <LayoutGrid container style={styles.drawer}>
        <LayoutGrid container item alignItems="center" justifyContent="space-between" style={styles.header}>
          <LayoutGrid item>
            <Text variant="h1">{wordings.settings}</Text>
          </LayoutGrid>
          <LayoutGrid item>
            <IconButton hint={wordings.cancel} onClick={props.close} iconName="close" />
          </LayoutGrid>
        </LayoutGrid>
        <LayoutGrid container direction="column" style={styles.displayModeContainer}>
          <LayoutGrid style={styles.displayModeTitle} item>
            <Text variant="h2"> {wordings.displayMode}</Text>
          </LayoutGrid>
          <LayoutGrid style={styles.radioButton} item>
            <RadioButton
              label={wordings.lightMode}
              isChecked={displayMode === 'light'}
              onClick={() => setDisplayMode('light')}
            />
          </LayoutGrid>
          <LayoutGrid style={styles.radioButton} item>
            <RadioButton
              label={wordings.darkMode}
              isChecked={displayMode === 'dark'}
              onClick={() => setDisplayMode('dark')}
            />
          </LayoutGrid>
        </LayoutGrid>
      </LayoutGrid>
    </Drawer>
  );

  function buildStyles(theme: Theme) {
    return {
      drawer: {
        width: 600,
        padding: theme.spacing(6),
      },
      header: {
        paddingBottom: theme.spacing(5),
        borderBottom: 'solid 1px',
        borderBottomColor: theme.palette.grey[400],
      },
      displayModeContainer: {
        paddingTop: theme.spacing(6),
      },
      displayModeTitle: {
        marginBottom: theme.spacing(3),
      },
      radioButton: {
        paddingLeft: theme.spacing(3),
      },
    };
  }
}
