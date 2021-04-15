import React from 'react';
import { customThemeType, useCustomTheme } from '../../../styles';
import { wordings } from '../../../wordings';
import { ButtonWithIcon, PopUp, Text } from '../../generic';

export { PasswordChangeConfirmationPopup };

function PasswordChangeConfirmationPopup(props: { onClose: () => void }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <PopUp>
      <div style={styles.textContainer}>
        <Text>{wordings.shared.passwordChangedConfirmation.text}</Text>
      </div>
      <div style={styles.buttonContainer}>
        <ButtonWithIcon
          iconName="check"
          onClick={props.onClose}
          text={wordings.shared.passwordChangedConfirmation.button}
          color="primary"
        />
      </div>
    </PopUp>
  );
}

function buildStyles(theme: customThemeType) {
  return {
    textContainer: { marginBottom: theme.spacing * 9 },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
  };
}
