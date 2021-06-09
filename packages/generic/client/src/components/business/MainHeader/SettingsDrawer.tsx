import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { apiCaller } from '../../../api';
import { routes } from '../../../pages';
import { localStorage } from '../../../services/localStorage';
import { useCustomTheme, customThemeType, useDisplayMode } from '../../../styles';
import { wordings } from '../../../wordings';
import { ButtonWithIcon, Drawer, RadioButton, Text, RichTextInput } from '../../generic';
import { PasswordChangeConfirmationPopup } from './PasswordChangeConfirmationPopup';
import { SettingsSection } from './SettingsSection';

export { SettingsDrawer };

type passwordChangeValidityType = 'valid' | 'notValidNewPassword' | 'wrongPassword' | 'newPasswordsDontMatch';

function SettingsDrawer(props: { close: () => void; isOpen: boolean }) {
  const theme = useCustomTheme();
  const { displayMode, setDisplayMode } = useDisplayMode();
  const styles = buildStyles(theme);
  const history = useHistory();

  const [previousPassword, setPreviousPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmedNewPassword, setConfirmedNewPassword] = useState('');
  const [passwordChangeValidity, setPasswordChangeValidity] = useState<passwordChangeValidityType>('valid');
  const [isPasswordConfirmationPopupShown, setIsPasswordConfirmationPopupShown] = useState(false);

  const userEmail = localStorage.userHandler.getEmail();
  const userName = localStorage.userHandler.getName();

  return (
    <>
      {isPasswordConfirmationPopupShown && (
        <PasswordChangeConfirmationPopup onClose={() => setIsPasswordConfirmationPopupShown(false)} />
      )}
      <Drawer onClose={props.close} title={wordings.shared.settingsDrawer.title} isOpen={props.isOpen}>
        <div style={styles.drawer}>
          <SettingsSection
            content={
              <div style={styles.accountSectionContent}>
                <div style={styles.accountInfoContainer}>
                  <Text variant="h2" weight="bold">
                    {userName}
                  </Text>
                  <Text variant="body1">{userEmail}</Text>
                </div>
                <ButtonWithIcon iconName="logout" color="default" onClick={logout} text={wordings.shared.logout} />
              </div>
            }
            title={wordings.business.account}
          />
          <SettingsSection
            content={
              <>
                <RadioButton
                  label={wordings.shared.settingsDrawer.lightMode}
                  isChecked={displayMode === 'lightMode'}
                  onClick={() => setDisplayMode('lightMode')}
                />
                <RadioButton
                  label={wordings.shared.settingsDrawer.darkMode}
                  isChecked={displayMode === 'darkMode'}
                  onClick={() => setDisplayMode('darkMode')}
                />
              </>
            }
            title={wordings.shared.settingsDrawer.displayMode}
          />

          <SettingsSection
            content={
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
                  <ButtonWithIcon
                    iconName="reset"
                    color="default"
                    onClick={updatePassword}
                    text={wordings.business.update}
                  />
                </div>
              </>
            }
            title={wordings.business.changePassword}
          />
        </div>
      </Drawer>
    </>
  );

  function logout() {
    localStorage.bearerTokenHandler.remove();
    history.push(routes.LOGIN.getPath());
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
        setIsPasswordConfirmationPopupShown(true);
        props.close();
        break;
      case 'wrongPassword':
        setPasswordChangeValidity('wrongPassword');
        break;
    }
  }

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

  function buildStyles(theme: customThemeType) {
    return {
      drawer: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 600,
      },
      accountSectionContent: {
        display: 'flex',
        justifyContent: 'space-between',
      },
      accountInfoContainer: {
        display: 'flex',
        flexDirection: 'column',
      },
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
}
