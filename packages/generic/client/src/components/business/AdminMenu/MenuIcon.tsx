import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { customThemeType, useCustomTheme, widths } from '../../../styles';
import { Icon, iconNameType } from '../../generic';

export { MenuIcon };

const MENU_ICON_HEIGHT = 72;

const CORNER_HEIGHT = 16;

function MenuIcon(props: { iconName: iconNameType; pathname: string }) {
  const theme = useCustomTheme();
  const location = useLocation();
  const history = useHistory();

  const styles = buildStyles(theme);
  return (
    <div style={styles.container}>
      <div style={styles.cornerSquare}>
        <div style={styles.topCorner} />
      </div>
      <div onClick={onClick} style={styles.iconContainer}>
        <Icon iconName={props.iconName} />
      </div>
      <div style={styles.cornerSquare}>
        <div style={styles.bottomCorner} />
      </div>
    </div>
  );

  function onClick() {
    history.replace(props.pathname);
  }

  function buildStyles(theme: customThemeType) {
    const isSelected = location.pathname === props.pathname;
    const backgroundColor = isSelected ? theme.colors.background : undefined;
    const color = isSelected ? theme.colors.line.level1 : theme.colors.line.level2;
    return {
      container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      },
      iconContainer: {
        color,
        height: `${MENU_ICON_HEIGHT}px`,
        width: `calc(${widths.adminMenu} - ${theme.spacing}px)`,
        backgroundColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: `${MENU_ICON_HEIGHT / 2}px`,
        borderBottomLeftRadius: `${MENU_ICON_HEIGHT / 2}px`,
        cursor: 'pointer',
      },
      cornerSquare: {
        backgroundColor,
      },
      topCorner: {
        height: CORNER_HEIGHT / 2,
        width: CORNER_HEIGHT / 2,
        borderBottomRightRadius: `${CORNER_HEIGHT / 2}px`,
        backgroundColor: theme.colors.default.background,
      },
      bottomCorner: {
        height: CORNER_HEIGHT,
        width: CORNER_HEIGHT,
        borderTopRightRadius: `${CORNER_HEIGHT / 2}px`,
        backgroundColor: theme.colors.default.background,
      },
    } as const;
  }
}
