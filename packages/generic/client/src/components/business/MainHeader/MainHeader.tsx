import React from 'react';
import { Header, IconButton, MenuBar, Text } from '../..';
import { customThemeType, heights, useCustomTheme } from '../../../styles';
import { wordings } from '../../../wordings';
import { SettingsButton } from './SettingsButton';

export { MainHeader };

function MainHeader(props: { subtitle?: JSX.Element; title?: string; onBackButtonPress?: () => void }) {
  const theme = useCustomTheme();
  const style = buildStyle(theme);
  const leftHeaderComponents = buildLeftHeaders();

  return (
    <MenuBar color="inherit" isElevated={!!props.title}>
      <Header
        leftHeaderComponents={leftHeaderComponents}
        rightHeaderComponents={[<SettingsButton />]}
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
    if (!props.title && !props.onBackButtonPress) {
      return [];
    }
    const textComponent = props.subtitle ? (
      <div>
        <Text variant="h3">{props.title}</Text>
        {props.subtitle}
      </div>
    ) : (
      <Text>{props.title}</Text>
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
