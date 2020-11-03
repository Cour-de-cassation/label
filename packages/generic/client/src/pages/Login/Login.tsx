import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Theme, useTheme } from '@material-ui/core';
import { Button, LayoutGrid, Logo, Text, TextInput } from '../../components';
import { login } from '../../services/api';
import { setBearerTokenIntoLocalStorage } from '../../services/localStorage';
import { wordings } from '../../wordings';

export { Login };

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const theme = useTheme();
  const styles = buildStyles(theme);

  return (
    <LayoutGrid container direction="column" justifyContent="center" alignItems="center" style={styles.mainContainer}>
      <LayoutGrid item style={styles.logoContainer}>
        <Logo size="medium" />
      </LayoutGrid>
      <LayoutGrid item style={styles.formContainer}>
        <LayoutGrid item style={styles.inputContainer}>
          <TextInput name="email" type="email" placeholder={wordings.email} onChange={changeEmail} value={email} />
        </LayoutGrid>
        <LayoutGrid item style={styles.inputContainer}>
          <TextInput
            name="password"
            type="password"
            placeholder={wordings.password}
            onChange={changePassword}
            value={password}
          />
        </LayoutGrid>
        <LayoutGrid item style={styles.forgottenPasswordContainer}>
          <Link to="/reset-password-request">
            <Text variant="subtitle1">{wordings.forgottenPassword}</Text>
          </Link>
        </LayoutGrid>
        <LayoutGrid item style={styles.loginButtonContainer}>
          <Button iconName="login" onClick={handleSubmit} color="primary">
            {wordings.login}
          </Button>
        </LayoutGrid>
      </LayoutGrid>
    </LayoutGrid>
  );

  function changeEmail(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function changePassword(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  async function handleSubmit() {
    try {
      const { data } = await login(email, password);
      setBearerTokenIntoLocalStorage(data);
      history.push('/');
    } catch (error) {
      console.warn(error);
    }
  }

  function buildStyles(theme: Theme) {
    return {
      mainContainer: {
        height: '100vh',
      },
      logoContainer: {
        marginBottom: theme.spacing(2),
      },
      formContainer: {
        padding: theme.spacing(6),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
      },
      inputContainer: {
        marginBottom: theme.spacing(3),
      },
      forgottenPasswordContainer: {
        marginBottom: theme.spacing(3),
      },
      loginButtonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
      },
    };
  }
};
