import React from 'react';
import { customThemeType, useCustomTheme } from '../../../styles';
import { wordings } from '../../../wordings';
import { Text } from '../materialUI';
import { ButtonWithIcon } from './ButtonWithIcon';
import { PopUp } from './PopUp';

export { ConfirmationPopup };

function ConfirmationPopup(props: { text: string; onConfirm: () => void; onClose: () => void }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <PopUp>
      <div style={styles.textContainer}>
        <Text>{props.text}</Text>
      </div>
      <div style={styles.buttonContainer}>
        <div style={styles.confirmButtonContainer}>
          <ButtonWithIcon iconName="check" onClick={props.onConfirm} text={wordings.shared.confirm} color="primary" />
        </div>
        <ButtonWithIcon iconName="close" onClick={props.onClose} text={wordings.shared.cancel} color="primary" />
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
    confirmButtonContainer: {
      marginRight: theme.spacing * 2,
    },
  };
}
