import React, { ChangeEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { apiCaller } from '../../../api';
import { localStorage } from '../../../services/localStorage';
import { useCustomTheme, customThemeType, useDisplayMode } from '../../../styles';
import { wordings } from '../../../wordings';
import { ButtonWithIcon, Drawer, IconButton, RadioButton, Text, TextInput } from '../../generic';
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

  const userEmail = localStorage.userHandler.getEmail();
  const userName = localStorage.userHandler.getName();

  return (
    <Drawer onClose={props.close} isOpen={props.isOpen}>
      <div style={styles.drawer}>
        <div style={styles.header}>
          <div>
            <Text variant="h1">{wordings.homePage.settings}</Text>
          </div>
          <div>
            <IconButton hint={wordings.homePage.cancel} onClick={props.close} iconName="close" />
          </div>
        </div>

        <SettingsSection
          content={
            <div style={styles.accountSectionContent}>
              <div>
                <Text variant="h2"> {userName}</Text>
                <Text variant="body1"> {userEmail}</Text>
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
                label={wordings.homePage.lightMode}
                isChecked={displayMode === 'lightMode'}
                onClick={() => setDisplayMode('lightMode')}
              />
              <RadioButton
                label={wordings.homePage.darkMode}
                isChecked={displayMode === 'darkMode'}
                onClick={() => setDisplayMode('darkMode')}
              />
            </>
          }
          title={wordings.homePage.displayMode}
        />

        <SettingsSection
          content={
            <>
              <TextInput
                error={shouldShowErrorForPreviousPassword()}
                errorText={wordings.business.wrongPassword}
                name="previousPassword"
                onChange={changePreviousPassword}
                placeholder={wordings.business.previousPassword}
                style={styles.passwordTextInput}
                type="password"
                value={previousPassword}
              />
              <TextInput
                error={shouldShowErrorForNewPassword()}
                errorText={computeErrorMessageForNewPassword()}
                helperText={wordings.business.newPasswordInstructions}
                name="newPassword"
                onChange={changeNewPassword}
                placeholder={wordings.business.newPassword}
                style={styles.passwordTextInput}
                type="password"
                value={newPassword}
              />
              <TextInput
                error={shouldShowErrorForNewPassword()}
                errorText={computeErrorMessageForNewPassword()}
                name="confirmedNewPassword"
                onChange={changeConfirmedNewPassword}
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
  );

  function logout() {
    localStorage.bearerTokenHandler.remove();
    history.push('/login');
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
        break;
      case 'wrongPassword':
        setPasswordChangeValidity('wrongPassword');
        break;
    }
  }

  function changePreviousPassword(event: ChangeEvent<HTMLInputElement>) {
    setPreviousPassword(event.target.value);
  }

  function shouldShowErrorForPreviousPassword() {
    return passwordChangeValidity === 'wrongPassword';
  }

  function changeNewPassword(event: ChangeEvent<HTMLInputElement>) {
    setNewPassword(event.target.value);
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

  function changeConfirmedNewPassword(event: ChangeEvent<HTMLInputElement>) {
    setConfirmedNewPassword(event.target.value);
  }

  function buildStyles(theme: customThemeType) {
    return {
      drawer: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 600,
        padding: theme.spacing * 6,
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: theme.spacing * 5,
        borderBottom: 'solid 1px',
        borderBottomColor: theme.colors.separator,
        width: '100%',
      },
      accountSectionContent: {
        display: 'flex',
        justifyContent: 'space-between',
      },
      passwordTextInput: {
        margin: `${theme.spacing * 2}px 0`,
        width: '100%',
      },
      passwordUpdateButtonContainer: {
        display: 'flex',
        justifyContent: 'flex-end' as const,
      },
    };
  }
}
