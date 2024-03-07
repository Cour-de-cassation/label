import React from 'react';
import { customThemeType, heights, useCustomTheme, Header, IconButton, MenuBar, Text } from 'pelta-design-system';
import { localStorage } from '../../../services/localStorage';
import { wordings } from '../../../wordings';
import { AdminViewDropdown } from './AdminViewDropdown';
import { PersonalStatisticsButton } from './PersonalStatisticsButton';
import { SettingsButton } from './SettingsButton';
import { PropTypes } from '@material-ui/core';

export { MainHeader };
let msg: string;
function MainHeader(props: {
  subtitle?: JSX.Element;
  title?: string;
  onBackButtonPress?: () => void;
  updateAdminMenu?: () => void;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const leftHeaderComponents = buildLeftHeaders();
  let color: PropTypes.Color;

  if (process.env.NODE_ENV === 'production') {
    color = 'inherit';
    msg = '';
  } else {
    color = process.env.NODE_ENV === 'test' ? 'primary' : 'secondary';
    msg = "Vous êtes sur l'envirronnement de test";
  }

  return (
    <MenuBar color={color} isElevated={!!props.title}>
      <Header
        leftHeaderComponents={leftHeaderComponents}
        rightHeaderComponents={buildRightHeaderComponents()}
        spaceBetweenComponents={theme.spacing * 2}
        style={styles.header}
        variant="classic"
      />
    </MenuBar>
  );

  function buildRightHeaderComponents() {
    const userRole = localStorage.userHandler.getRole();
    if (userRole === 'admin') {
      return [
        <AdminViewDropdown updateAdminMenu={props.updateAdminMenu} />,
        <PersonalStatisticsButton />,
        <SettingsButton />,
      ];
    }
    return [<PersonalStatisticsButton />, <SettingsButton />];
  }

  function buildStyles(theme: customThemeType) {
    return {
      header: {
        height: heights.header,
        paddingLeft: theme.spacing,
      },
      composedTitleContainer: {
        display: 'flex',
        flexDirection: 'column',
      },
    } as const;
  }

  function buildLeftHeaders() {
    if (!props.title && !props.onBackButtonPress) {
      return [];
    }
    const textComponent = props.subtitle ? (
      <div style={styles.composedTitleContainer}>
        <Text variant="h3">{props.title + ' | ' + msg}</Text>
        <Text>{props.subtitle}</Text>
      </div>
    ) : (
      <Text>{props.title + ' | ' + msg}</Text>
    );
    if (props.onBackButtonPress) {
      const backButton = (
        <IconButton hint={wordings.shared.back} iconName="arrowLeft" onClick={props.onBackButtonPress} />
      );
      return [backButton, textComponent];
    } else {
      return [textComponent];
    }
  }
}
