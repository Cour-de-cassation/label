import React from 'react';
import { useHistory } from 'react-router-dom';
import { Header, IconButton, MenuBar, Text } from '../..';
import { localStorage } from '../../../services/localStorage';
import { customThemeType, heights, useCustomTheme } from '../../../styles';
import { wordings } from '../../../wordings';
import { SettingsButton } from './SettingsButton';

export { MainHeader };

function MainHeader(props: { title?: string }) {
  const theme = useCustomTheme();
  const style = buildStyle(theme);
  const history = useHistory();
  const leftHeaderComponents = props.title ? [<Text>{props.title}</Text>] : [];

  return (
    <MenuBar color="inherit" isElevated={!!props.title}>
      <Header
        leftHeaderComponents={leftHeaderComponents}
        rightHeaderComponents={[
          <SettingsButton />,
          <IconButton iconName="logout" hint={wordings.logout} onClick={logout} />,
        ]}
        spaceBetweenComponents={theme.spacing * 2}
        style={style.header}
        variant="classic"
      />
    </MenuBar>
  );

  function buildStyle(theme: customThemeType) {
    return {
      header: {
        height: heights.header,
        paddingLeft: theme.spacing,
      },
    };
  }

  function logout() {
    localStorage.bearerTokenHandler.remove();
    history.push('/login');
  }
}
