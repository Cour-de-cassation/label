import React, { useState } from 'react';
import { customThemeType, useCustomTheme, ButtonWithIcon, RichTextInput } from 'pelta-design-system';
import { apiCaller } from '../../../api';
import { localStorage } from '../../../services/localStorage';
import { wordings } from '../../../wordings';

export { ResetPasswordForm };

type passwordChangeValidityType = 'valid' | 'notValidNewPassword' | 'wrongPassword' | 'newPasswordsDontMatch';

function ResetPasswordForm(props: { onUpdatePassword: () => void }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const [passwordChangeValidity, setPasswordChangeValidity] = useState<passwordChangeValidityType>('valid');
  const [previousPassword, setPreviousPassword] = useState('');
  const [confirmedNewPassword, setConfirmedNewPassword] = useState('');

  const [newPassword, setNewPassword] = useState('');
  return (
    <>
      <RichTextInput
        error={shouldShowErrorForPreviousPassword()}
        errorText={wordings.business.wrongPassword}
        name="previousPassword"
        onChange={setPreviousPassword}
        placeholder={wordings.business.previousPassword}
        style={styles.passwordTextInput}
        type="password"
        value={previousPassword}
      />
      <RichTextInput
        error={shouldShowErrorForNewPassword()}
        errorText={computeErrorMessageForNewPassword()}
        helperText={wordings.business.newPasswordInstructions}
        name="newPassword"
        onChange={setNewPassword}
        placeholder={wordings.business.newPassword}
        style={styles.passwordTextInput}
        type="password"
        value={newPassword}
      />
      <RichTextInput
        error={shouldShowErrorForNewPassword()}
        errorText={computeErrorMessageForNewPassword()}
        name="confirmedNewPassword"
        onChange={setConfirmedNewPassword}
        placeholder={wordings.business.confirmPassword}
        style={styles.passwordTextInput}
        type="password"
        value={confirmedNewPassword}
      />
      <div style={styles.passwordUpdateButtonContainer}>
        <ButtonWithIcon iconName="reset" color="default" onClick={updatePassword} text={wordings.business.update} />
      </div>
    </>
  );

  function shouldShowErrorForPreviousPassword() {
    return passwordChangeValidity === 'wrongPassword';
  }

  function shouldShowErrorForNewPassword() {
    return passwordChangeValidity === 'notValidNewPassword' || passwordChangeValidity === 'newPasswordsDontMatch';
  }

  function computeErrorMessageForNewPassword() {
    if (passwordChangeValidity === 'newPasswordsDontMatch') {
      return wordings.business.newPasswordsDontMatch;
    }

    return wordings.business.newPasswordInstructions;
  }

  async function updatePassword() {
    if (newPassword !== confirmedNewPassword) {
      setPasswordChangeValidity('newPasswordsDontMatch');
      return;
    }

    const result = await apiCaller.post<'changePassword'>('changePassword', { previousPassword, newPassword });

    switch (result.data) {
      case 'notValidNewPassword':
        setPasswordChangeValidity('notValidNewPassword');
        break;
      case 'passwordUpdated':
        setPreviousPassword('');
        setNewPassword('');
        setConfirmedNewPassword('');
        setPasswordChangeValidity('valid');
        localStorage.userHandler.setPasswordTimeValidityStatus('valid');
        props.onUpdatePassword();
        break;
      case 'wrongPassword':
        setPasswordChangeValidity('wrongPassword');
        break;
    }
  }
}

function buildStyles(theme: customThemeType) {
  return {
    passwordTextInput: {
      margin: `${theme.spacing * 2}px 0`,
      width: '100%',
    },
    passwordUpdateButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end' as const,
    },
  } as const;
}
