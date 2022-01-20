import React from 'react';
import { customThemeType, useCustomTheme, ButtonWithIcon, PopUp, Text } from 'pelta-design-system';
import { wordings } from '../../../../wordings';

export { WorkingUserCreatedPopUp };

function WorkingUserCreatedPopUp(props: { password: string; onClose: () => void }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <PopUp>
      <div style={styles.textContainer}>
        <Text>
          {wordings.workingUsersPage.createWorkingUserDrawer.createdWorkingUserPopup.createdWorkingUserConfirmation}
        </Text>
        <br />
        <Text>{wordings.workingUsersPage.createWorkingUserDrawer.createdWorkingUserPopup.passwordIndication}</Text>
      </div>
      <div style={styles.passwordContainer}>
        <Text variant="h1">{props.password}</Text>
      </div>
      <div style={styles.buttonContainer}>
        <ButtonWithIcon
          onClick={props.onClose}
          iconName="edit"
          text={wordings.workingUsersPage.createWorkingUserDrawer.createdWorkingUserPopup.button}
          color="primary"
        />
      </div>
    </PopUp>
  );
}

function buildStyles(theme: customThemeType) {
  return {
    textContainer: { marginBottom: theme.spacing * 9 },
    passwordContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing * 8,
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
  };
}
