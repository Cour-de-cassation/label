import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { customThemeType, useCustomTheme, ConfirmationPopup } from 'pelta-design-system';
import { ResetPasswordForm } from '../../components';
import { localStorage } from '../../services/localStorage';
import { wordings } from '../../wordings';
import { routes } from '../routes';

export { ResetPassword };

const FORM_WIDTH = 400;

function ResetPassword() {
  const theme = useCustomTheme();
  const history = useHistory();
  const styles = buildStyles(theme);
  const [isInformationPopupOpen, setIsInformationPopupOpen] = useState(true);

  return (
    <div style={styles.container}>
      {isInformationPopupOpen && (
        <ConfirmationPopup
          text={wordings.resetPasswordPage.popup}
          onCancel={logout}
          onConfirm={() => setIsInformationPopupOpen(false)}
        />
      )}
      <div style={styles.formContainer}>
        <ResetPasswordForm onUpdatePassword={onUpdatePassword} />
      </div>
    </div>
  );

  function logout() {
    localStorage.userHandler.remove();
    localStorage.bearerTokenHandler.remove();
    history.push(routes.DEFAULT.getPath());
  }

  function onUpdatePassword() {
    history.push(routes.DEFAULT.getPath());
  }
}

function buildStyles(theme: customThemeType) {
  return {
    container: {
      flexDirection: 'column',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: FORM_WIDTH,
      padding: theme.spacing * 6,
      paddingBottom: theme.spacing * 3,
      borderRadius: theme.shape.borderRadius.m,
      boxShadow: theme.boxShadow.major.out,
    },
  } as const;
}
