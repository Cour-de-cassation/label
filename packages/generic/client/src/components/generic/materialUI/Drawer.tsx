import React, { ReactNode } from 'react';
import { Drawer as MuiDrawer, makeStyles } from '@material-ui/core';
import { customThemeType, heights, useCustomTheme } from '../../../styles';
import { wordings } from '../../../wordings';
import { IconButton, Text } from '../../generic';
import { zIndices } from './constants';

export { Drawer };

function Drawer(props: { children?: ReactNode; title: string; isOpen: boolean; onClose: () => void }) {
  const theme = useCustomTheme();
  const styles = buildStyles();
  const classes = buildClasses(theme);

  return (
    <MuiDrawer style={styles.drawer} classes={classes} anchor="right" open={props.isOpen} onClose={props.onClose}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <Text variant="h1">{props.title}</Text>
          </div>
          <div>
            <IconButton hint={wordings.shared.cancel} onClick={props.onClose} iconName="close" />
          </div>
        </div>
        <div style={styles.content}>{props.children}</div>
      </div>
    </MuiDrawer>
  );

  function buildStyles() {
    return {
      drawer: {
        zIndex: zIndices.drawer,
      },
      container: {
        paddingLeft: theme.spacing * 8,
        paddingRight: theme.spacing * 8,
        height: 'inherit',
        display: 'flex',
        flexDirection: 'column',
      },
      content: {
        overflow: 'auto',
        paddingBottom: theme.spacing * 4,
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: theme.spacing * 3,
        marginTop: theme.spacing * 4,
        borderBottom: 'solid 1px',
        borderBottomColor: theme.colors.separator,
        width: '100%',
      },
    } as const;
  }

  function buildClasses(theme: customThemeType) {
    return makeStyles({
      paper: {
        boxShadow: theme.boxShadow.minor.out,
        marginTop: heights.header,
        height: heights.adminPanel,
      },
    })();
  }
}
