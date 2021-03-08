import React from 'react';
import { useHistory } from 'react-router-dom';
import { localStorage } from '../../../services/localStorage';
import { useCustomTheme, customThemeType, useDisplayMode } from '../../../styles';
import { wordings } from '../../../wordings';
import { ButtonWithIcon, Drawer, IconButton, RadioButton, Text } from '../../generic';
import { SettingsSection } from './SettingsSection';

export { SettingsDrawer };

function SettingsDrawer(props: { close: () => void; isOpen: boolean }) {
  const theme = useCustomTheme();
  const { displayMode, setDisplayMode } = useDisplayMode();
  const styles = buildStyles(theme);
  const history = useHistory();

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
      </div>
    </Drawer>
  );

  function logout() {
    localStorage.bearerTokenHandler.remove();
    history.push('/login');
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
    };
  }
}
