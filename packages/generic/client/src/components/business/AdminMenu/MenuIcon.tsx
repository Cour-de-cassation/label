import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { customThemeType, useCustomTheme, Icon, iconNameType, Tooltip } from 'pelta-design-system';
import { widths } from '../../../styles';
import { AlertBadge } from './AlertBadge';

export { MenuIcon };

const ICON_CONTAINER_HEIGHT = 50;

const ICON_SIZE = 28;

const CORNER_HEIGHT = 10;

function MenuIcon(props: { iconName: iconNameType; pathname: string; title: string; alertCount?: number }) {
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
        {renderIcon()}
      </div>
      <div style={styles.cornerSquare}>
        <div style={styles.bottomCorner} />
      </div>
    </div>
  );

  function renderIcon() {
    return (
      <>
        {!!props.alertCount && (
          <div style={styles.alertBadgeContainer}>
            <AlertBadge count={props.alertCount} />
          </div>
        )}
        <Tooltip title={props.title} placement="right">
          <Icon style={styles.icon} iconName={props.iconName} />
        </Tooltip>
      </>
    );
  }

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
        position: 'relative',
        height: `${ICON_CONTAINER_HEIGHT}px`,
        width: `calc(${widths.adminMenu} - ${theme.spacing}px)`,
        backgroundColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: `${ICON_CONTAINER_HEIGHT / 2}px`,
        borderBottomLeftRadius: `${ICON_CONTAINER_HEIGHT / 2}px`,
        cursor: 'pointer',
      },
      icon: {
        fontSize: `${ICON_SIZE}px`,
      },
      alertBadgeContainer: {
        position: 'absolute',
        display: 'flex',
        right: `calc(${widths.adminMenu} - ${ICON_CONTAINER_HEIGHT / 2}px - ${ICON_SIZE}px - ${theme.spacing}px)`,
        top: `calc(${ICON_CONTAINER_HEIGHT / 2}px - ${ICON_SIZE / 2}px - ${theme.spacing}px)`,
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
