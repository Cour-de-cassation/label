import React from 'react';
import { useHistory } from 'react-router';
import { customThemeType, useCustomTheme, ButtonWithIcon, Icon, Text } from 'pelta-design-system';
import { localStorage } from '../../services/localStorage';
import { wordings } from '../../wordings';
import { routes } from '../routes';
import format from 'string-template';

export { ErrorPage };

function ErrorPage(props: { route?: string; errorCode?: number }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const history = useHistory();

  return (
    <div style={styles.container}>
      <div style={styles.errorPage}>
        <Icon iconName="warning" style={styles.errorIcon} />
        <Text style={styles.errorText}>{wordings.errorPage.title}</Text>
        {props.errorCode && (
          <Text style={styles.errorText} variant="body2">
            {format(wordings.errorPage.errorCode, { code: props.errorCode })}
          </Text>
        )}
        {props.route && (
          <Text style={styles.errorText} variant="body2">
            {format(wordings.errorPage.onRequest, { route: props.route })}
          </Text>
        )}
        <div style={styles.buttonContainer}>
          <ButtonWithIcon iconName="reset" color="default" onClick={reload} text={wordings.shared.refresh} />
        </div>
        <Text style={styles.errorText}>{wordings.shared.or}</Text>
        <div style={styles.buttonContainer}>
          <ButtonWithIcon iconName="logout" color="default" onClick={logout} text={wordings.shared.logout} />
        </div>
      </div>
    </div>
  );

  function logout() {
    localStorage.bearerTokenHandler.remove();
    localStorage.userHandler.remove();
    history.push(routes.LOGIN.getPath());
  }

  function reload() {
    history.go(0);
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
        textAlign: 'center',
      },
      errorIcon: {
        alignSelf: 'center',
        fontSize: '100px',
        padding: theme.spacing * 3,
      },
      errorText: {
        marginBottom: theme.spacing,
      },
      buttonContainer: {
        marginBottom: theme.spacing,
        display: 'flex',
        justifyContent: 'center',
      },
    } as const;
  }
}
