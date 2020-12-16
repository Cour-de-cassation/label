import React from 'react';
import { useHistory } from 'react-router-dom';
import { Header, IconButton, MenuBar, Text } from '../..';
import { localStorage } from '../../../services/localStorage';
import { customThemeType, heights, useCustomTheme } from '../../../styles';
import { wordings } from '../../../wordings';
import { SettingsButton } from './SettingsButton';

export { MainHeader };

function MainHeader(props: { subtitle?: string; title?: string }) {
  const theme = useCustomTheme();
  const style = buildStyle(theme);
  const history = useHistory();
  const leftHeaderComponents = buildLeftHeaders();

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

  function buildLeftHeaders() {
    if (!props.title) {
      return [];
    }
    if (props.subtitle) {
      return [
        <div>
          <Text variant="h3">{props.title}</Text>
          <Text>{props.subtitle}</Text>
        </div>,
      ];
    }
    return [<Text>{props.title}</Text>];
  }

  function logout() {
    localStorage.bearerTokenHandler.remove();
    history.push('/login');
  }
}
