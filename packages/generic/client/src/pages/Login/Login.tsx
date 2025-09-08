import React, { FunctionComponent, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { customThemeType, useCustomTheme } from 'pelta-design-system';
import { Logo } from '../../components';
import { urlHandler } from '../../utils';

export { Login };

const Login: FunctionComponent = () => {
  const history = useHistory();
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  useEffect(() => {
    window.location.href = urlHandler.getSsoLoginUrl();
  }, [history]);

  return (
    <div style={styles.mainContainer}>
      Redirection vers SSO...
      <div style={styles.logoContainer}>
        <Logo size="medium" />
      </div>
    </div>
  );

  function buildStyles(theme: customThemeType) {
    return {
      mainContainer: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      },
      logoContainer: {
        marginBottom: theme.spacing * 2,
      },
    } as const;
  }
};
