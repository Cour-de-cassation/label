import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDisplayMode, ButtonWithIcon, Drawer, RadioButton, Text } from 'pelta-design-system';
import { routes } from '../../../pages';
import { localStorage } from '../../../services/localStorage';
import { wordings } from '../../../wordings';
import { ResetPasswordForm } from '../ResetPasswordForm';
import { PasswordChangeConfirmationPopup } from './PasswordChangeConfirmationPopup';
import { SettingsSection } from './SettingsSection';

export { SettingsDrawer };

function SettingsDrawer(props: { close: () => void; isOpen: boolean }) {
  const { displayMode, setDisplayMode } = useDisplayMode();
  const styles = buildStyles();
  const history = useHistory();

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
            content={<ResetPasswordForm onUpdatePassword={onUpdatePassword} />}
            title={wordings.business.changePassword}
          />
        </div>
      </Drawer>
    </>
  );

  function onUpdatePassword() {
    setIsPasswordConfirmationPopupShown(true);
    props.close();
  }

  function logout() {
    localStorage.bearerTokenHandler.remove();
    localStorage.userHandler.remove();
    history.push(routes.DEFAULT.getPath());
  }

  function buildStyles() {
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
    } as const;
  }
}
