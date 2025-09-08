import React from 'react';
import { customThemeType, heights, useCustomTheme, Header, IconButton, MenuBar, Text } from 'pelta-design-system';
import { wordings } from '../../../wordings';
import { AdminViewDropdown } from './AdminViewDropdown';
import { PersonalStatisticsButton } from './PersonalStatisticsButton';
import { SettingsButton } from './SettingsButton';
import { useCtxUser } from '../../../contexts/user.context';

export { MainHeader };

function MainHeader(props: {
  subtitle?: JSX.Element;
  title?: string;
  onBackButtonPress?: () => void;
  updateAdminMenu?: () => void;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const leftHeaderComponents = buildLeftHeaders();

  const { user, loading } = useCtxUser();
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MenuBar color="inherit" isElevated={!!props.title}>
      <Header
        leftHeaderComponents={leftHeaderComponents}
        rightHeaderComponents={buildRightHeaderComponents(user)}
        spaceBetweenComponents={theme.spacing * 2}
        style={styles.header}
        variant="classic"
      />
    </MenuBar>
  );

  function buildRightHeaderComponents(user?: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const userRole = user?.role;
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
