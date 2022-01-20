import React from 'react';
import { useHistory } from 'react-router';
import { customThemeType, useCustomTheme, ButtonWithIcon, Icon, Text } from 'pelta-design-system';
import { localStorage } from '../../services/localStorage';
import { wordings } from '../../wordings';
import { routes } from '../routes';

export { ErrorPage };

function ErrorPage() {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const history = useHistory();

  return (
    <div style={styles.container}>
      <div style={styles.errorPage}>
        <Icon iconName="warning" style={styles.errorIcon} />
        <Text style={styles.errorText}>{wordings.errorPage}</Text>
        <ButtonWithIcon iconName="logout" color="default" onClick={logout} text={wordings.shared.logout} />
      </div>
    </div>
  );

  function logout() {
    localStorage.bearerTokenHandler.remove();
    localStorage.userHandler.remove();
    history.push(routes.LOGIN.getPath());
  }

  function buildStyles(theme: customThemeType) {
    return {
      container: {
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
      errorPage: {
        display: 'flex',
        flexDirection: 'column',
      },
      errorIcon: {
        alignSelf: 'center',
        fontSize: '100px',
        padding: theme.spacing * 3,
      },
      errorText: {
        marginBottom: theme.spacing,
      },
    } as const;
  }
}
