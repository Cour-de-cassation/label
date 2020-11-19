import React, { ChangeEvent, CSSProperties, FunctionComponent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ButtonWithIcon, LayoutGrid, Logo, Text, TextInput } from '../../components';
import { login } from '../../services/api';
import { setBearerTokenIntoLocalStorage } from '../../services/localStorage';
import { wordings } from '../../wordings';
import { customThemeType, useCustomTheme } from '../../styles';

export { Login };

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(true);

  const history = useHistory();
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <LayoutGrid container direction="column" justifyContent="center" alignItems="center" style={styles.mainContainer}>
      <LayoutGrid item style={styles.logoContainer}>
        <Logo size="medium" />
      </LayoutGrid>
      <LayoutGrid item style={styles.formContainer}>
        <LayoutGrid item style={styles.inputContainer}>
          <TextInput
            name="email"
            type="email"
            placeholder={wordings.email}
            onChange={changeEmail}
            value={email}
            error={!isFormValid}
          />
        </LayoutGrid>
        <LayoutGrid item style={styles.inputContainer}>
          <TextInput
            name="password"
            type="password"
            placeholder={wordings.password}
            onChange={changePassword}
            value={password}
            error={!isFormValid}
          />
        </LayoutGrid>
        <LayoutGrid item style={styles.forgottenPasswordContainer}>
          <Link to="/reset-password-request">
            <Text style={styles.forgottenPasswordText} variant="h3">
              {wordings.forgottenPassword}
            </Text>
          </Link>
        </LayoutGrid>
        <LayoutGrid item direction="column" alignItems="flex-end" style={styles.loginButtonContainer}>
          <ButtonWithIcon
            iconName={isFormValid ? 'login' : 'error'}
            onClick={handleSubmit}
            color={isFormValid ? 'primary' : 'alert'}
            text={wordings.login}
          />
        </LayoutGrid>
        <LayoutGrid item direction="column">
          {!isFormValid && (
            <LayoutGrid item direction="column">
              <Text style={styles.formErrorText} variant="h3">
                {wordings.wrongEmailOrPassword}
              </Text>
              <Text style={styles.formErrorText} variant="h3">
                {wordings.pleaseTryAgain}
              </Text>
            </LayoutGrid>
          )}
        </LayoutGrid>
      </LayoutGrid>
    </LayoutGrid>
  );

  function resetIsFormValid() {
    if (!isFormValid) {
      setIsFormValid(true);
    }
  }

  function changeEmail(event: ChangeEvent<HTMLInputElement>) {
    resetIsFormValid();
    setEmail(event.target.value);
  }

  function changePassword(event: ChangeEvent<HTMLInputElement>) {
    resetIsFormValid();
    setPassword(event.target.value);
  }

  async function handleSubmit() {
    try {
      const { data } = await login(email, password);
      setBearerTokenIntoLocalStorage(data);
      history.push('/');
    } catch (error) {
      setIsFormValid(false);
      console.warn(error);
    }
  }

  function buildStyles(theme: customThemeType): { [cssClass: string]: CSSProperties } {
    return {
      mainContainer: {
        height: '100vh',
      },
      logoContainer: {
        marginBottom: theme.spacing * 2,
      },
      formContainer: {
        padding: theme.spacing * 6,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.colors.background.highlight,
      },
      inputContainer: {
        marginBottom: theme.spacing * 3,
      },
      forgottenPasswordContainer: {
        marginBottom: theme.spacing * 3,
      },
      forgottenPasswordText: {
        textDecoration: 'underline',
      },
      loginButtonContainer: {
        display: 'flex',
        marginBottom: theme.spacing,
      },
      formErrorText: {
        textAlign: 'right',
      },
    };
  }
};
