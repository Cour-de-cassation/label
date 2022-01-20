import { idModule } from '@label/core';
import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { customThemeType, useCustomTheme, LoginForm } from 'pelta-design-system';
import { apiCaller } from '../../api';
import { Logo } from '../../components';
import { localStorage } from '../../services/localStorage';
import { routes } from '../routes';

export { Login };

const Login: FunctionComponent = () => {
  const history = useHistory();
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <div style={styles.mainContainer}>
      <div style={styles.logoContainer}>
        <Logo size="medium" />
      </div>
      <LoginForm handleSubmit={handleSubmit} />
    </div>
  );

  async function handleSubmit({ email, password }: { email: string; password: string }) {
    const {
      data: { _id, email: userEmail, name, role, token, passwordTimeValidityStatus },
    } = await apiCaller.post<'login'>('login', { email, password });
    localStorage.bearerTokenHandler.set(token);
    localStorage.userHandler.set({ _id: idModule.lib.buildId(_id), email: userEmail, name, role });
    localStorage.userHandler.setPasswordTimeValidityStatus(passwordTimeValidityStatus);
    history.push(routes.DEFAULT.getPath());
  }

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
