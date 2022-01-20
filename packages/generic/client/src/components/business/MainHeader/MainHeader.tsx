import React from 'react';
import { customThemeType, heights, useCustomTheme, Header, IconButton, MenuBar, Text } from 'pelta-design-system';
import { localStorage } from '../../../services/localStorage';
import { wordings } from '../../../wordings';
import { AdminViewDropdown } from './AdminViewDropdown';
import { SettingsButton } from './SettingsButton';

export { MainHeader };

function MainHeader(props: { subtitle?: JSX.Element; title?: string; onBackButtonPress?: () => void }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const leftHeaderComponents = buildLeftHeaders();

  return (
    <MenuBar color="inherit" isElevated={!!props.title}>
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
      return [<AdminViewDropdown />, <SettingsButton />];
    }
    return [<SettingsButton />];
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
        <Text variant="h3">{props.title}</Text>
        <Text>{props.subtitle}</Text>
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
