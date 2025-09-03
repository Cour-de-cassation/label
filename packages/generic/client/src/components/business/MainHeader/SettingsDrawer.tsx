import React from 'react';
import { useDisplayMode, ButtonWithIcon, Drawer, RadioButton, Text } from 'pelta-design-system';
import { localStorage } from '../../../services/localStorage';
import { wordings } from '../../../wordings';
import { SettingsSection } from './SettingsSection';
import { useCtxUser } from '../../../contexts/user.context';
import { urlHandler } from '../../../utils';

export { SettingsDrawer };

function SettingsDrawer(props: { close: () => void; isOpen: boolean }) {
  const { displayMode, setDisplayMode } = useDisplayMode();
  const styles = buildStyles();
  const { user, loading } = useCtxUser();

  if (loading) {
    return <div>Loading...</div>;
  }
  const userEmail = user?.email;
  const userName = user?.name;

  return (
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
      </div>
    </Drawer>
  );

  function logout() {
    localStorage.adminViewHandler.remove();
    window.location.replace(urlHandler.getSsoLogoutUrl());
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
